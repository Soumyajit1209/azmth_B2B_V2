"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CustomerSearch } from "./customer-search";

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
        {/* <div className="p-4 font-bold text-lg"></div> */}
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
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {selectedCustomer ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center space-x-3 shrink-0">
              <Avatar>
                <AvatarImage
                  src={selectedCustomer.avatar || "/placeholder.svg"}
                />
                <AvatarFallback>
                  {selectedCustomer.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{selectedCustomer.name}</div>
                <div className="text-sm text-muted-foreground">
                  {selectedCustomer.company}
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 min-h-0 overflow-y-auto p-4">
              <div className="text-center text-sm text-muted-foreground">
                Chat with {selectedCustomer.name} will appear here.
              </div>
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t shrink-0">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border rounded-md"
                />
                <Button>Send</Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Select a customer to start chatting.
          </div>
        )}
      </div>
    </div>
  );
}
