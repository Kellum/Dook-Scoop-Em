import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Users, Search } from "lucide-react";

interface Customer {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  numberOfDogs: number;
  subscription: {
    id: string;
    plan: string;
    status: string;
    stripePriceId: string;
  } | null;
}

interface CustomersResponse {
  customers: Customer[];
}

export default function AdminCustomers() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading } = useQuery<CustomersResponse>({
    queryKey: ["/api/admin/customers"],
  });

  const customers = data?.customers || [];

  // Filter customers based on search term
  const filteredCustomers = customers.filter((customer) => {
    const fullName = `${customer.firstName || ""} ${customer.lastName || ""}`.toLowerCase();
    const search = searchTerm.toLowerCase();
    return (
      fullName.includes(search) ||
      customer.email.toLowerCase().includes(search) ||
      customer.phone?.toLowerCase().includes(search) ||
      customer.address?.toLowerCase().includes(search)
    );
  });

  const getSubscriptionBadge = (subscription: Customer["subscription"]) => {
    if (!subscription) {
      return <Badge variant="outline">No Subscription</Badge>;
    }

    const statusColor =
      subscription.status === "active"
        ? "bg-green-500"
        : subscription.status === "canceled"
        ? "bg-red-500"
        : "bg-yellow-500";

    return (
      <Badge className={statusColor}>
        {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
      </Badge>
    );
  };

  const getPlanName = (plan: string) => {
    const planNames: Record<string, string> = {
      weekly: "Weekly",
      biweekly: "Bi-Weekly",
      twice_weekly: "Twice Weekly",
    };
    return planNames[plan] || plan;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center py-12">Loading customers...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-black text-gray-900" data-testid="heading-customers">
              Customers
            </h1>
            <p className="text-gray-600">View and manage all customers</p>
          </div>
          <Link href="/admin">
            <Button variant="outline" data-testid="button-back-to-dashboard">
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Search by name, email, phone, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              data-testid="input-search-customers"
            />
          </CardContent>
        </Card>

        {/* Customers Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              All Customers ({filteredCustomers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredCustomers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? "No customers found matching your search" : "No customers yet"}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Dogs</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers.map((customer) => (
                      <TableRow key={customer.id} data-testid={`row-customer-${customer.id}`}>
                        <TableCell className="font-medium" data-testid={`text-name-${customer.id}`}>
                          {customer.firstName && customer.lastName
                            ? `${customer.firstName} ${customer.lastName}`
                            : customer.email}
                        </TableCell>
                        <TableCell data-testid={`text-email-${customer.id}`}>
                          {customer.email}
                        </TableCell>
                        <TableCell data-testid={`text-phone-${customer.id}`}>
                          {customer.phone || "-"}
                        </TableCell>
                        <TableCell data-testid={`text-address-${customer.id}`}>
                          {customer.address
                            ? `${customer.address}, ${customer.city || ""}, ${customer.state || ""} ${customer.zipCode || ""}`
                            : "-"}
                        </TableCell>
                        <TableCell data-testid={`text-dogs-${customer.id}`}>
                          {customer.numberOfDogs}
                        </TableCell>
                        <TableCell data-testid={`text-plan-${customer.id}`}>
                          {customer.subscription ? getPlanName(customer.subscription.plan) : "-"}
                        </TableCell>
                        <TableCell data-testid={`badge-status-${customer.id}`}>
                          {getSubscriptionBadge(customer.subscription)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
