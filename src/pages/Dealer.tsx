import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, MapPin, Crown, Heart, Star, ThumbsUp, Menu, Search } from "lucide-react";
import { Link } from "react-router-dom";
import SEOHead from "@/components/seo/SEOHead";

// Mock dealer and car data
const dealers = [
	{
		id: 1,
		name: "Abcd Cars",
		location: "San Francisco",
		whatsapp: "+91-9876543210",
		cars: [
			{
				id: 101,
				name: "Chevrolet Spark",
				image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=400&q=80",
				price: 140000,
				model: "2011",
				owner: "2",
				kms: "88000",
				variant: "LT",
				tags: ["Standard Insurance"],
				badges: ["Heart"],
			},
			{
				id: 102,
				name: "Toyota Camry",
				image: "https://images.unsplash.com/photo-1511918984145-48de785d4c4e?auto=format&fit=crop&w=400&q=80",
				price: 800000,
				model: "Mid-Size Car",
				miles: "200 Miles Included",
				gps: "GPS",
				roadside: "24/7 Roadside Assistance",
				tags: ["Standard Insurance"],
				badges: ["Most People Choice", "ThumbsUp"],
			},
			{
				id: 103,
				name: "Mahindrs XUV 500",
				image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=400&q=80",
				price: 1250000,
				model: "Full-Size Car",
				miles: "Unlimited Miles",
				driver: "Driver",
				roadside: "24/7 Roadside Assistance",
				premium: "Premium Insurance",
				tags: ["Premium Insurance"],
				badges: ["Crown"],
			},
		],
	},
	{
		id: 2,
		name: "XYZ Motors",
		location: "Mumbai",
		whatsapp: "+91-9876543210",
		cars: [
			{
				id: 201,
				name: "Hyundai Verna",
				image: "https://images.unsplash.com/photo-1461632830798-3adb3034e4c8?auto=format&fit=crop&w=400&q=80",
				price: 920000,
				model: "2019",
				owner: "1",
				kms: "45000",
				variant: "SX",
				tags: ["Standard Insurance"],
				badges: ["Crown"],
			},
			{
				id: 202,
				name: "Maruti Swift",
				image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
				price: 650000,
				model: "2020",
				owner: "1",
				kms: "32000",
				variant: "ZXI",
				tags: ["Standard Insurance"],
				badges: ["Most People Choice"],
			},
		],
	},
];

const DealerPage: React.FC = () => {
	const [selectedDealerId, setSelectedDealerId] = useState(dealers[0].id);
	const selectedDealer = dealers.find((d) => d.id === selectedDealerId);

	return (
		<Layout>
			<SEOHead
				title="Dealers - VahaanXchange"
				description="Find verified dealers and their car listings on VahaanXchange"
				canonicalUrl="https://www.vahaanxchange.com/dealer"
			/>
			
			{/* Blue Header Section */}
			<div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-4">
				<div className="max-w-7xl mx-auto text-center">
					{/* Menu and Search Icons */}
					<div className="flex justify-between items-center mb-8">
						<Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
							<Menu className="h-6 w-6" />
						</Button>
						<Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
							<Search className="h-6 w-6" />
						</Button>
					</div>
					
					{/* Dealer Title */}
					<div className="text-center">
						<p className="text-lg font-medium mb-2 opacity-90">DEALER</p>
						<h1 className="text-4xl md:text-5xl font-bold">
							{selectedDealer?.name || "Abcd Cars"}
						</h1>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="max-w-7xl mx-auto px-4 py-12">
				{/* Car Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{selectedDealer?.cars.map((car) => (
						<Card key={car.id} className="rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 bg-gray-100 border-0">
							<CardContent className="p-6">
								{/* Car Image with Badges */}
								<div className="relative mb-4">
									<img 
										src={car.image} 
										alt={car.name} 
										className="rounded-xl w-full h-48 object-cover"
									/>
									
									{/* Badges */}
									<div className="absolute top-3 left-3 right-3 flex justify-between items-start">
										{car.badges.includes("Most People Choice") && (
											<span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
												Most People Choice
											</span>
										)}
										<div className="flex gap-2">
											{car.badges.includes("Heart") && (
												<div className="bg-white rounded-full p-2 shadow-md">
													<Heart className="h-5 w-5 text-gray-600" />
												</div>
											)}
											{car.badges.includes("ThumbsUp") && (
												<div className="bg-white rounded-full p-2 shadow-md">
													<ThumbsUp className="h-5 w-5 text-gray-600" />
												</div>
											)}
											{car.badges.includes("Crown") && (
												<div className="bg-white rounded-full p-2 shadow-md">
													<Crown className="h-5 w-5 text-yellow-500" />
												</div>
											)}
										</div>
									</div>
								</div>

								{/* Car Name */}
								<h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
									{car.name}
								</h3>

								{/* Car Details */}
								<div className="space-y-2 mb-4 text-sm text-gray-600">
									{car.model && car.owner && (
										<div className="flex justify-between">
											<span>model: {car.model}</span>
											<span>Owner: {car.owner}</span>
										</div>
									)}
									{car.kms && car.variant && (
										<div className="flex justify-between">
											<span>KMS: {car.kms}</span>
											<span>Variant: {car.variant}</span>
										</div>
									)}
									{car.miles && car.gps && (
										<div className="flex justify-between">
											<span>{car.miles}</span>
											<span>{car.gps}</span>
										</div>
									)}
									{car.roadside && (
										<div className="text-center">
											<span>{car.roadside}</span>
										</div>
									)}
									{car.premium && (
										<div className="text-center">
											<span>{car.premium}</span>
										</div>
									)}
								</div>

								{/* Tags */}
								<div className="flex flex-wrap gap-2 mb-4">
									{car.tags.map((tag, i) => (
										<span 
											key={i} 
											className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium"
										>
											{tag}
										</span>
									))}
								</div>

								{/* Price */}
								<div className="text-center">
									<span className="text-2xl font-bold text-orange-500">
										Rs.{car.price.toLocaleString("en-IN")}
									</span>
								</div>
							</CardContent>
						</Card>
					))}
				</div>

				{/* Contact Section */}
				<div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
					<div className="flex flex-col md:flex-row items-center justify-between gap-6">
						<div className="flex items-center gap-4">
							<MapPin className="h-8 w-8 text-gray-600" />
							<span className="text-xl font-semibold text-gray-800">
								Location: {selectedDealer?.location}
							</span>
						</div>
						<div className="flex items-center gap-4">
							<span className="text-lg font-medium text-gray-600">CONTACT</span>
							<div className="flex items-center gap-3">
								<MessageCircle className="h-8 w-8 text-green-500" />
								<span className="text-xl font-bold text-pink-500">
									{selectedDealer?.whatsapp}
								</span>
							</div>
						</div>
					</div>
				</div>

				{/* Dealer Selection (Hidden but functional) */}
				<div className="mt-8 flex justify-center">
					<div className="flex gap-4">
						{dealers.map((dealer) => (
							<Button
								key={dealer.id}
								variant={selectedDealerId === dealer.id ? "default" : "outline"}
								onClick={() => setSelectedDealerId(dealer.id)}
								className="hidden"
							>
								{dealer.name}
							</Button>
						))}
					</div>
				</div>
			</div>
		</Layout>
	);
};

export default DealerPage;
