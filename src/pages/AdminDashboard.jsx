import React from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../components/ui/tabs";

import OverviewSection from "./sections/Overview";
import ProductManagement from "./sections/ProductManagement";
import OrderManagement from "./sections/OrderManagement";
import UserManagement from "./sections/UserManagement";
import ReviewsModeration from "./sections/ReviewsModeration";
import CMSManagement from "./sections/CMSManagement";
import CategoryMangement from "./sections/CategoryMangement";
import YouTube from "./sections/YouTube";

export default function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <Tabs defaultValue="products" className="w-full">
        <TabsList className="flex gap-2 flex-wrap overflow-x-auto mb-6">
          <TabsTrigger value="products">Product Management</TabsTrigger>
          <TabsTrigger value="category">Category Management</TabsTrigger>
          <TabsTrigger value="orders">Order Management</TabsTrigger>
          <TabsTrigger value="reviews">Reviews & Ratings</TabsTrigger>
          <TabsTrigger value="cms">Content Management</TabsTrigger>
          <TabsTrigger value="youtube">YouTube Management</TabsTrigger>
        </TabsList>


        <TabsContent value="products">
          <ProductManagement />
        </TabsContent>
        <TabsContent value="category">
          <CategoryMangement/>
        </TabsContent>
        <TabsContent value="orders">
          <OrderManagement />
        </TabsContent>
        <TabsContent value="users">
          <UserManagement />
        </TabsContent>
        <TabsContent value="reviews">
          <ReviewsModeration />
        </TabsContent>
        <TabsContent value="cms">
          <CMSManagement />
        </TabsContent>
        <TabsContent value="youtube">
          <YouTube />
        </TabsContent>
      </Tabs>
    </div>
  );
}
