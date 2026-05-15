import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Edit, Trash2, Eye, EyeOff, Plus, Upload } from "lucide-react";
import { Button } from "/src/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "/src/Components/ui/card";
import { Input } from "/src/Components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "/src/Components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "/src/Components/ui/alert-dialog";
import { Label } from "/src/Components/ui/label";
import { useToast } from "/src/hooks/use-toast";

import { app } from "@/firebase/firebaseConfig";
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const db = getFirestore(app);
const storage = getStorage(app);

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryImage, setNewCategoryImage] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  // ✅ Fetch Categories in real-time
  useEffect(() => {
    const q = query(collection(db, "categories"), orderBy("createdAt"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(data);
    });
    return () => unsubscribe();
  }, []);

  // ✅ Upload Image to Firebase Storage
  const uploadImage = async (file) => {
    if (!file) return null;
    const storageRef = ref(storage, `categories/${Date.now()}-${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  };

  // ✅ Add Category
  const handleAddCategory = async () => {
    if (!newCategoryName.trim() || !newCategoryImage) return;

    const imageUrl = await uploadImage(newCategoryImage);

    const newCategory = {
      name: newCategoryName.trim(),
      image: imageUrl,
      isHidden: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await addDoc(collection(db, "categories"), newCategory);

    setNewCategoryName("");
    setNewCategoryImage(null);
    setIsAddDialogOpen(false);
    toast({
      title: "✅ Category Added",
      description: `${newCategory.name} has been added successfully.`,
    });
  };

  // ✅ Edit Category
  const handleEditCategory = async () => {
    if (!editingCategory || !newCategoryName.trim()) return;

    let imageUrl = editingCategory.image;
    if (newCategoryImage instanceof File) {
      imageUrl = await uploadImage(newCategoryImage);
    }

    const docRef = doc(db, "categories", editingCategory.id);
    await updateDoc(docRef, {
      name: newCategoryName.trim(),
      image: imageUrl,
      updatedAt: serverTimestamp(),
    });

    setEditingCategory(null);
    setNewCategoryName("");
    setNewCategoryImage(null);
    setIsEditDialogOpen(false);
    toast({ title: "✅ Category Updated" });
  };

  // ✅ Delete Category
  const handleDeleteCategory = async (categoryId) => {
    await deleteDoc(doc(db, "categories", categoryId));
    toast({ title: "🗑️ Category Deleted" });
  };

  // ✅ Toggle Visibility
  const handleToggleVisibility = async (category) => {
    const docRef = doc(db, "categories", category.id);
    await updateDoc(docRef, {
      isHidden: !category.isHidden,
      updatedAt: serverTimestamp(),
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Category List</h1>
            <p className="text-muted-foreground">Manage categories</p>
          </div>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="category-name">Category Name</Label>
                <Input
                  id="category-name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Enter category name"
                />
              </div>
              <div>
                <Label htmlFor="category-image">Category Image</Label>
                <Input
                  id="category-image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewCategoryImage(e.target.files[0])}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddCategory}>Add Category</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories List */}
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between border rounded-lg p-4 shadow-sm bg-background"
            >
              {/* Image + Name */}
              <div className="flex items-center gap-4">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-16 h-16 rounded-md object-cover"
                />
                <span className="font-medium">{category.name}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {/* Toggle visibility */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleVisibility(category)}
                >
                  {category.isHidden ? (
                    <EyeOff className="h-4 w-4 mr-1" />
                  ) : (
                    <Eye className="h-4 w-4 mr-1" />
                  )}
                  {category.isHidden ? "Hidden" : "Visible"}
                </Button>

                {/* Edit */}
                <Dialog
                  open={isEditDialogOpen && editingCategory?.id === category.id}
                  onOpenChange={setIsEditDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingCategory(category);
                        setNewCategoryName(category.name);
                        setNewCategoryImage(category.image);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Category</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="edit-category-name">Category Name</Label>
                        <Input
                          id="edit-category-name"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-category-image">Category Image</Label>
                        <Input
                          id="edit-category-image"
                          type="file"
                          accept="image/*"
                          onChange={(e) => setNewCategoryImage(e.target.files[0])}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleEditCategory}>Update</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Delete */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Category</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{category.name}"?
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteCategory(category.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
