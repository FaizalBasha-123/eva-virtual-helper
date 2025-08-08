import React from "react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, MoreVertical, Trash2 } from "lucide-react";

interface DealerDashboardCardActionsProps {
	onViewDetails?: () => void;
	onDelete?: () => void;
}

const DealerDashboardCardActions: React.FC<DealerDashboardCardActionsProps> = ({
	onViewDetails,
	onDelete,
}) => {
	return (
		<div className="absolute top-2 left-2 z-20">
			<DropdownMenu>
				<DropdownMenuTrigger asChild aria-label="Open vehicle actions">
					<Button
						variant="secondary"
						size="icon"
						className="h-8 w-8 shadow-sm"
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
						}}
					>
						<MoreVertical className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start">
					<DropdownMenuItem
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							onViewDetails?.();
						}}
					>
						<Eye className="h-4 w-4 mr-2" /> View Details
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							onDelete?.();
						}}
						className="text-red-600 focus:text-red-600"
					>
						<Trash2 className="h-4 w-4 mr-2" /> Delete Post
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};

export default DealerDashboardCardActions;
