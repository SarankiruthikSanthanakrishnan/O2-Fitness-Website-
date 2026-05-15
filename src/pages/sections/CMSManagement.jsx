import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../Components/ui/dialog";
import { Button } from "../../Components/ui/button";
import { Input } from "../../Components/ui/input";
import { Label } from "../../Components/ui/label";
import { Textarea } from "../../Components/ui/textarea";
import { Badge } from "../../Components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../Components/ui/card";
import { Eye, Edit, Trash2, Plus, Upload, X } from "lucide-react";

import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "@/firebase/firebaseConfig";

const db = getFirestore(app);
const storage = getStorage(app);

const CMSManagement = () => {
  const [slides, setSlides] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    buttonText: "",
    buttonLink: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchSlides = async () => {
      const querySnapshot = await getDocs(collection(db, "sliders"));
      const sliderData = [];
      querySnapshot.forEach((doc) =>
        sliderData.push({ id: doc.id, ...doc.data() })
      );
      setSlides(sliderData);
    };
    fetchSlides();
  }, []);

  const resetForm = () => {
    setFormData({
      title: "",
      subtitle: "",
      description: "",
      buttonText: "",
      buttonLink: "",
    });
    setImageFile(null);
    setImagePreview(null);
    setEditingSlide(null);
  };

  const handleInputChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const uploadImage = async (file) => {
    const storageRef = ref(storage, `sliderImages/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, subtitle, description, buttonText, buttonLink } = formData;

    if (!title || !subtitle || !description || !buttonText || !buttonLink) {
      alert("All fields are required.");
      return;
    }

    try {
      let imageUrl = editingSlide?.image || null;

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const slideData = {
        title,
        subtitle,
        description,
        buttonText,
        buttonLink,
        image: imageUrl,
        updatedAt: Timestamp.now(),
      };

      if (editingSlide) {
        const docRef = doc(db, "sliders", editingSlide.id);
        await updateDoc(docRef, slideData);
        setSlides((prev) =>
          prev.map((s) =>
            s.id === editingSlide.id ? { ...s, ...slideData } : s
          )
        );
      } else {
        const docRef = await addDoc(collection(db, "sliders"), {
          ...slideData,
          createdAt: Timestamp.now(),
        });
        setSlides((prev) => [...prev, { id: docRef.id, ...slideData }]);
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving slide:", error);
    }
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "sliders", id));
    setSlides((prev) => prev.filter((s) => s.id !== id));
  };

  const handleEdit = (slide) => {
    setFormData({
      title: slide.title,
      subtitle: slide.subtitle,
      description: slide.description,
      buttonText: slide.buttonText,
      buttonLink: slide.buttonLink,
    });
    setImagePreview(slide.image);
    setEditingSlide(slide);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Slider Management</h1>
          <p className="text-muted-foreground">
            Manage your homepage hero slider content
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Slide
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
            <DialogHeader>
              <DialogTitle>
                {editingSlide ? "Edit Slide" : "Add New Slide"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Input
                    id="subtitle"
                    value={formData.subtitle}
                    onChange={(e) =>
                      handleInputChange("subtitle", e.target.value)
                    }
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={3}
                  required
                />
              </div>
              <div>
                <Label>Slide Image</Label>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        document.getElementById("image-upload").click()
                      }
                    >
                      <Upload className="h-4 w-4" />
                      {imageFile || imagePreview
                        ? "Change Image"
                        : "Upload Image"}
                    </Button>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    {(imageFile || imagePreview) && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={removeImage}
                        className="text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded border"
                    />
                  ) : (
                    <div className="border-2 border-dashed p-8 text-center rounded">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Click "Upload Image" to select an image file
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="buttonText">Button Text</Label>
                  <Input
                    id="buttonText"
                    value={formData.buttonText}
                    onChange={(e) =>
                      handleInputChange("buttonText", e.target.value)
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="buttonLink">Button Link</Label>
                  <Input
                    id="buttonLink"
                    value={formData.buttonLink}
                    onChange={(e) =>
                      handleInputChange("buttonLink", e.target.value)
                    }
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingSlide ? "Update Slide" : "Add Slide"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {slides.map((slide, index) => (
          <Card key={slide.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg">Slide {index + 1}</CardTitle>
                  <Badge variant="secondary">{slide.subtitle}</Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open("/", "_blank")}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(slide)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(slide.id)}
                    disabled={slides.length <= 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-2xl">{slide.title}</h3>
                    <p className="text-primary font-medium">{slide.subtitle}</p>
                  </div>
                  <p className="text-muted-foreground">{slide.description}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{slide.buttonText}</Badge>
                    <span className="text-sm text-muted-foreground">
                      → {slide.buttonLink}
                    </span>
                  </div>
                </div>
                <div className="relative rounded-lg overflow-hidden">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {slides.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground mb-4">No slides found</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Slide
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CMSManagement;
