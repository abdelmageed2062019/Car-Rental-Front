"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  Plus,
  Search,
  MapPin,
  Edit,
  Trash2,
  Eye,
  Filter,
  SortAsc,
  SortDesc,
  Map,
  List,
} from "lucide-react";
import { useAllBranches, useCreateBranch, useUpdateBranch, useDeleteBranch, useBranchStats } from "@/hooks/useBranches";
import { BranchData } from "@/lib/crud/branches";
import BranchForm from "@/components/dashboard/BranchForm";
import DeleteConfirmDialog from "@/components/dashboard/DeleteConfirmDialog";
import BranchMap from "@/components/dashboard/BranchMap";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function BranchesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<any>(null);
  const [editingBranch, setEditingBranch] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  // Fetch data
  const { data: branchesResponse, isLoading: branchesLoading, refetch: refetchBranches } = useAllBranches();
  const createBranchMutation = useCreateBranch();
  const updateBranchMutation = useUpdateBranch();
  const deleteBranchMutation = useDeleteBranch();

  // Get branches data
  const branches = branchesResponse?.data || [];
  const stats = useBranchStats(branches).data;

  // Filter and sort branches
  const filteredBranches = branches
    .filter((branch) => {
      const matchesSearch = 
        branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branch.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branch.city.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCountry = !countryFilter || countryFilter === "all" || branch.country === countryFilter;
      
      return matchesSearch && matchesCountry;
    })
    .sort((a, b) => {
      let aValue = a[sortBy as keyof typeof a];
      let bValue = b[sortBy as keyof typeof b];
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }
      
      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  // Get unique countries for filter
  const countries = Array.from(new Set(branches.map(branch => branch.country)));

  const handleCreateBranch = async (branchData: BranchData) => {
    try {
      await createBranchMutation.mutateAsync(branchData);
      toast.success("Branch created successfully!");
      refetchBranches();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create branch");
    }
  };

  const handleUpdateBranch = async (branchData: BranchData) => {
    if (!editingBranch) return;
    
    try {
      await updateBranchMutation.mutateAsync({
        branchId: editingBranch._id,
        updateData: branchData,
      });
      toast.success("Branch updated successfully!");
      refetchBranches();
      setEditingBranch(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update branch");
    }
  };

  const handleDeleteBranch = async () => {
    if (!selectedBranch) return;
    
    try {
      await deleteBranchMutation.mutateAsync(selectedBranch._id);
      toast.success("Branch deleted successfully!");
      refetchBranches();
      setSelectedBranch(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete branch");
    }
  };

  const openEditForm = (branch: any) => {
    setEditingBranch(branch);
    setIsFormOpen(true);
  };

  const openDeleteDialog = (branch: any) => {
    setSelectedBranch(branch);
    setIsDeleteDialogOpen(true);
  };

  const openCreateForm = () => {
    setEditingBranch(null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingBranch(null);
  };

  const getCountryColor = (country: string) => {
    const colors: { [key: string]: string } = {
      "USA": "bg-blue-100 text-blue-800",
      "UK": "bg-red-100 text-red-800",
      "Japan": "bg-green-100 text-green-800",
      "UAE": "bg-yellow-100 text-yellow-800",
      "Egypt": "bg-orange-100 text-orange-800",
      "Canada": "bg-purple-100 text-purple-800",
      "France": "bg-pink-100 text-pink-800",
      "Germany": "bg-gray-100 text-gray-800",
      "Australia": "bg-indigo-100 text-indigo-800",
      "Brazil": "bg-emerald-100 text-emerald-800",
    };
    return colors[country] || "bg-gray-100 text-gray-800";
  };

  if (branchesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF9E0C]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Building2 className="w-8 h-8" />
            Branch Management
          </h1>
          <p className="text-gray-600">
            Manage your rental branches and locations
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className={viewMode === "list" ? "bg-[#FF9E0C] hover:bg-[#FF9E0C] text-white" : ""}
            >
              <List className="w-4 h-4 mr-2" />
              List
            </Button>
            <Button
              variant={viewMode === "map" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("map")}
              className={viewMode === "map" ? "bg-[#FF9E0C] hover:bg-[#FF9E0C] text-white" : ""}
            >
              <Map className="w-4 h-4 mr-2" />
              Map
            </Button>
          </div>
          
          <Button
            onClick={openCreateForm}
            className="bg-[#FF9E0C] hover:bg-[#FF9E0C] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Branch
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Branches</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBranches}</div>
              <p className="text-xs text-muted-foreground">
                Active locations
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Branches</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeBranches}</div>
              <p className="text-xs text-muted-foreground">
                Currently operational
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Countries</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Object.keys(stats.branchesByCountry).length}</div>
              <p className="text-xs text-muted-foreground">
                Different countries
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cities</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Object.keys(stats.branchesByCity).length}</div>
              <p className="text-xs text-muted-foreground">
                Different cities
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Search - Only show in list view */}
      {viewMode === "list" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search branches..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={countryFilter} onValueChange={setCountryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="city">City</SelectItem>
                  <SelectItem value="country">Country</SelectItem>
                  <SelectItem value="address">Address</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="flex items-center gap-2"
              >
                {sortOrder === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                {sortOrder === "asc" ? "Ascending" : "Descending"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Branches Content - List or Map View */}
      {viewMode === "list" ? (
        <Card>
          <CardHeader>
            <CardTitle>
              Branches ({filteredBranches.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredBranches.length === 0 ? (
              <div className="text-center py-8">
                <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No branches found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || (countryFilter && countryFilter !== "all")
                    ? "Try adjusting your search or filter criteria."
                    : "Get started by adding your first branch."}
                </p>
                {!searchTerm && (!countryFilter || countryFilter === "all") && (
                  <Button onClick={openCreateForm} className="bg-[#FF9E0C] hover:bg-[#FF9E0C]">
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Branch
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBranches.map((branch) => (
                  <div
                    key={branch._id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{branch.name}</h3>
                        <Badge className={getCountryColor(branch.country)}>
                          {branch.country}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <MapPin className="w-4 h-4" />
                        <span>{branch.address}, {branch.city}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Coordinates: {branch.location.coordinates[0]}, {branch.location.coordinates[1]}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditForm(branch)}
                        className="text-blue-600 hover:text-blue-700"
                        title="Edit Branch"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDeleteDialog(branch)}
                        className="text-red-600 hover:text-red-700"
                        title="Delete Branch"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Branch Locations ({branches.length})
            </h2>
            <p className="text-sm text-gray-600">
              Click on markers to view branch details
            </p>
          </div>
          <BranchMap 
            branches={branches} 
            height="600px"
            className="w-full"
          />
        </div>
      )}

      <BranchForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSubmit={editingBranch ? handleUpdateBranch : handleCreateBranch}
        branch={editingBranch}
        title={editingBranch ? "Edit Branch" : "Add New Branch"}
      />

      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteBranch}
        title="Delete Branch"
        description="Are you sure you want to delete this branch? This action cannot be undone."
        itemName={selectedBranch?.name}
        isLoading={deleteBranchMutation.isPending}
      />
    </div>
  );
}
