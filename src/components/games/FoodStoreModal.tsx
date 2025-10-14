"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Droplet, ShoppingCart, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { toast } from "sonner";
import { buyItems } from "@/lib/api";
import type { BuyRequest } from "@/types/api";

interface FoodItem {
  id: number;
  name: string;
  description: string;
  icon: string;
  price: number;
  happinessBoost: number;
  xpBoost: number;
}

interface FoodStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  waterDrops: number;
  isBuying: boolean;
  setIsBuying: (loading: boolean) => void;
  onPurchaseSuccess: () => void;
}

const foods: FoodItem[] = [
  {
    id: 1,
    name: "Dew Crystals",
    description: "Kristal murni yang terbentuk dari embun pagi",
    icon: "/image/games/dew.webp",
    price: 20,
    happinessBoost: 10,
    xpBoost: 5,
  },
  {
    id: 2,
    name: "Starlight Mote",
    description: "Serpihan cahaya dari bintang yang paling terang",
    icon: "/image/games/star.webp",
    price: 50,
    happinessBoost: 25,
    xpBoost: 20,
  },
  {
    id: 3,
    name: "Rainbow Dust",
    description: "Debu ajaib dari pelangi yang muncul setelah hujan",
    icon: "/image/games/rainbow.webp",
    price: 90,
    happinessBoost: 40,
    xpBoost: 30,
  },
  {
    id: 4,
    name: "Sunlight",
    description: "Energi murni dari inti matahari yang memberi kehangatan",
    icon: "/image/games/sun.webp",
    price: 100,
    happinessBoost: 3,
    xpBoost: 5,
  },
];

export default function FoodStoreModal({
  isOpen,
  onClose,
  waterDrops,
  isBuying,
  setIsBuying,
  onPurchaseSuccess,
}: FoodStoreModalProps) {
  const handleBuyFood = async (food: FoodItem) => {
    if (isBuying) return;

    if (waterDrops >= food.price) {
      setIsBuying(true);
      try {
        const buyData: BuyRequest = {
          water: food.price,
          exp: food.xpBoost,
          happiness: food.happinessBoost,
        };

        const response = await buyItems(buyData);

        if (response.success) {
          toast.success(
            `Cirrus menikmati ${food.name}! Kebahagiaan +${food.happinessBoost}%, XP +${food.xpBoost}`
          );
          onClose();
          onPurchaseSuccess();
        } else {
          toast.error(response.message || "Gagal membeli makanan!");
        }
      } catch (error) {
        console.error("Error buying food:", error);
        toast.error("Terjadi kesalahan saat membeli makanan!");
      } finally {
        setIsBuying(false);
      }
    } else {
      toast.error("Tetesan embun tidak cukup!");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        size="xl"
        className="max-w-4xl w-full max-h-[90vh] overflow-auto"
      >
        {/* Header */}
        <DialogHeader>
          <div className="flex items-center justify-between mb-6">
            {/* Left: Title & Subtitle */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-purple-900">
                  Toko Makanan
                </DialogTitle>
                <p className="text-purple-600 text-sm">
                  Pilih makanan untuk Cirrus
                </p>
              </div>
            </div>

            {/* Right: Resource Info */}
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 rounded-full px-4 py-2 flex items-center gap-2">
                <div className="w-5 h-5 bg-blue-400 rounded-full flex items-center justify-center">
                  <Droplet className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-semibold text-blue-900">
                  {waterDrops} Tetesan Embun
                </span>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Body */}
        <div className="space-y-6">
          {/* Grid List of Foods */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {foods.map((food, index) => (
              <motion.div
                key={food.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="p-4 text-center h-full flex flex-col">
                  <Image
                    src={food.icon}
                    alt={food.name}
                    width={80}
                    height={80}
                    className="mx-auto mb-3 select-none"
                  />
                  <h3 className="font-bold text-lg text-purple-900 mb-2">
                    {food.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4 flex-1">
                    {food.description}
                  </p>

                  {/* Stat Boosts */}
                  <div className="flex flex-col gap-2 mb-4 items-center">
                    <Badge variant="outline" className="text-xs">
                      Kebahagiaan +{food.happinessBoost}%
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Pengalaman +{food.xpBoost} XP
                    </Badge>
                  </div>

                  {/* Price */}
                  <div className="bg-blue-50 rounded-lg p-3 mb-4">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center">
                        <Droplet className="w-3 h-3 text-white" />
                      </div>
                      <span className="font-bold text-blue-900">
                        {food.price} Tetesan Embun
                      </span>
                    </div>
                  </div>

                  {/* Buy Button */}
                  <Button
                    className={`w-full ${
                      waterDrops >= food.price
                        ? "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                        : "bg-gray-300 cursor-not-allowed"
                    }`}
                    disabled={waterDrops < food.price || isBuying}
                    onClick={() => handleBuyFood(food)}
                  >
                    {isBuying ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      "Beli Makanan"
                    )}
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
