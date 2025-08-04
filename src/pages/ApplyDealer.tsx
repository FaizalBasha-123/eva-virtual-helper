import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import SEOHead from "@/components/seo/SEOHead";

const ApplyDealerPage: React.FC = () => {
	const [formData, setFormData] = useState({
		businessName: "",
		ownerName: "",
		email: "",
		phone: "",
		address: "",
		city: "",
		state: "",
		pincode: "",
		businessType: "",
		yearsInBusiness: "",
		description: "",
		gstNumber: "",
		panNumber: "",
	});

	const handleInputChange = (field: string, value: string) => {
		setFormData(prev => ({
			...prev,
			[field]: value
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Handle form submission
		console.log("Dealer application submitted:", formData);
		// You can add API call here
	};

	return (
		<Layout>
			<SEOHead
				title="Apply as Dealer - VahaanXchange"
				description="Join VahaanXchange as a verified dealer and showcase your inventory to thousands of potential buyers"
				canonicalUrl="https://www.vahaanxchange.com/apply-dealer"
			/>
			
			<div className="min-h-screen bg-gray-50 py-12 px-4">
				<div className="max-w-4xl mx-auto">
					{/* Header */}
					<div className="mb-8">
						<Link 
							to="/dealer" 
							className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-4"
						>
							<ArrowLeft className="h-4 w-4" />
							Back to Dealers
						</Link>
						<h1 className="text-3xl font-bold text-gray-900">Apply as a Dealer</h1>
						<p className="text-gray-600 mt-2">
							Join VahaanXchange and showcase your inventory to thousands of potential buyers
						</p>
					</div>

					{/* Form */}
					<Card className="shadow-lg">
						<CardHeader>
							<CardTitle className="text-xl">Dealer Application Form</CardTitle>
						</CardHeader>
						<CardContent>
							<form onSubmit={handleSubmit} className="space-y-6">
								{/* Business Information */}
								<div className="space-y-4">
									<h3 className="text-lg font-semibold text-gray-900">Business Information</h3>
									
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<Label htmlFor="businessName">Business Name *</Label>
											<Input
												id="businessName"
												value={formData.businessName}
												onChange={(e) => handleInputChange("businessName", e.target.value)}
												placeholder="Enter your business name"
												required
											/>
										</div>
										<div>
											<Label htmlFor="ownerName">Owner Name *</Label>
											<Input
												id="ownerName"
												value={formData.ownerName}
												onChange={(e) => handleInputChange("ownerName", e.target.value)}
												placeholder="Enter owner's full name"
												required
											/>
										</div>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<Label htmlFor="email">Email Address *</Label>
											<Input
												id="email"
												type="email"
												value={formData.email}
												onChange={(e) => handleInputChange("email", e.target.value)}
												placeholder="business@example.com"
												required
											/>
										</div>
										<div>
											<Label htmlFor="phone">Phone Number *</Label>
											<Input
												id="phone"
												type="tel"
												value={formData.phone}
												onChange={(e) => handleInputChange("phone", e.target.value)}
												placeholder="+91 98765 43210"
												required
											/>
										</div>
									</div>

									<div>
										<Label htmlFor="businessType">Business Type *</Label>
										<Select value={formData.businessType} onValueChange={(value) => handleInputChange("businessType", value)}>
											<SelectTrigger>
												<SelectValue placeholder="Select business type" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="authorized-dealer">Authorized Dealer</SelectItem>
												<SelectItem value="used-car-dealer">Used Car Dealer</SelectItem>
												<SelectItem value="multi-brand-dealer">Multi-Brand Dealer</SelectItem>
												<SelectItem value="individual-dealer">Individual Dealer</SelectItem>
											</SelectContent>
										</Select>
									</div>

									<div>
										<Label htmlFor="yearsInBusiness">Years in Business *</Label>
										<Select value={formData.yearsInBusiness} onValueChange={(value) => handleInputChange("yearsInBusiness", value)}>
											<SelectTrigger>
												<SelectValue placeholder="Select years in business" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="less-than-1">Less than 1 year</SelectItem>
												<SelectItem value="1-3">1-3 years</SelectItem>
												<SelectItem value="3-5">3-5 years</SelectItem>
												<SelectItem value="5-10">5-10 years</SelectItem>
												<SelectItem value="more-than-10">More than 10 years</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>

								{/* Address Information */}
								<div className="space-y-4">
									<h3 className="text-lg font-semibold text-gray-900">Address Information</h3>
									
									<div>
										<Label htmlFor="address">Business Address *</Label>
										<Textarea
											id="address"
											value={formData.address}
											onChange={(e) => handleInputChange("address", e.target.value)}
											placeholder="Enter complete business address"
											rows={3}
											required
										/>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
										<div>
											<Label htmlFor="city">City *</Label>
											<Input
												id="city"
												value={formData.city}
												onChange={(e) => handleInputChange("city", e.target.value)}
												placeholder="Enter city"
												required
											/>
										</div>
										<div>
											<Label htmlFor="state">State *</Label>
											<Input
												id="state"
												value={formData.state}
												onChange={(e) => handleInputChange("state", e.target.value)}
												placeholder="Enter state"
												required
											/>
										</div>
										<div>
											<Label htmlFor="pincode">Pincode *</Label>
											<Input
												id="pincode"
												value={formData.pincode}
												onChange={(e) => handleInputChange("pincode", e.target.value)}
												placeholder="Enter pincode"
												required
											/>
										</div>
									</div>
								</div>

								{/* Legal Information */}
								<div className="space-y-4">
									<h3 className="text-lg font-semibold text-gray-900">Legal Information</h3>
									
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<Label htmlFor="gstNumber">GST Number</Label>
											<Input
												id="gstNumber"
												value={formData.gstNumber}
												onChange={(e) => handleInputChange("gstNumber", e.target.value)}
												placeholder="Enter GST number"
											/>
										</div>
										<div>
											<Label htmlFor="panNumber">PAN Number *</Label>
											<Input
												id="panNumber"
												value={formData.panNumber}
												onChange={(e) => handleInputChange("panNumber", e.target.value)}
												placeholder="Enter PAN number"
												required
											/>
										</div>
									</div>
								</div>

								{/* Additional Information */}
								<div className="space-y-4">
									<h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
									
									<div>
										<Label htmlFor="description">Business Description</Label>
										<Textarea
											id="description"
											value={formData.description}
											onChange={(e) => handleInputChange("description", e.target.value)}
											placeholder="Tell us about your business, inventory, and why you want to join VahaanXchange"
											rows={4}
										/>
									</div>
								</div>

								{/* Document Upload */}
								<div className="space-y-4">
									<h3 className="text-lg font-semibold text-gray-900">Document Upload</h3>
									<div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
										<Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
										<p className="text-gray-600 mb-2">Upload business documents</p>
										<p className="text-sm text-gray-500">GST Certificate, Trade License, PAN Card (PDF, JPG, PNG - Max 5MB each)</p>
										<Button type="button" variant="outline" className="mt-4">
											Choose Files
										</Button>
									</div>
								</div>

								{/* Submit Button */}
								<div className="pt-6">
									<Button type="submit" className="w-full md:w-auto px-8 py-3 text-lg">
										Submit Application
									</Button>
								</div>
							</form>
						</CardContent>
					</Card>
				</div>
			</div>
		</Layout>
	);
};

export default ApplyDealerPage;
