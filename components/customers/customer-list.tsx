"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CustomerSearch } from "./customer-search";
import { ChatWindow } from "./chat-window";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: string;
  lastContact: string;
  totalSpent: number;
  avatar: string;
}

export function CustomerList() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch("/api/customers");
        const data = await response.json();
        setCustomers(data.customers);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching customers:", error);
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  return (
    <div className="flex max-h-screen">
      {/* Sidebar */}
      <div className="w-1/3 border-r overflow-y-auto">
        <CustomerSearch />
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <ul>
            {customers.map((customer) => (
              <li
                key={customer.id}
                className={`p-4 cursor-pointer hover:bg-gray-950 ${
                  selectedCustomer?.id === customer.id ? "bg-gray-950" : ""
                }`}
                onClick={() => setSelectedCustomer(customer)}
              >
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={customer.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {customer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{customer.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {customer.company}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Chat Window */}
      <ChatWindow selectedCustomer={selectedCustomer} />
    </div>
  );
}