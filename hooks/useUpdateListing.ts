"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import useAxiosAuth from "./useAxiosAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { basicListingSchema, teamMemberSchema } from "@/lib/schemas";
import type { Location , Project } from "@/types";

type TeamMember = z.infer<typeof teamMemberSchema>;
type FormData = z.infer<typeof basicListingSchema>;

const useUpdateListing = (id: string) => {
  const queryClient = useQueryClient();
  const [formFilled, setFormFilled] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | undefined>();
  const [selectedProject, setSelectedProject] = useState<any | undefined>();
  const router = useRouter();
  const axiosAuth = useAxiosAuth();

  const form = useForm<FormData>({
    resolver: zodResolver(basicListingSchema),
    defaultValues: {
      title: "",
      email: "",
      phone: "",
      locationId: undefined,
      projectId: undefined,
      category: undefined,
      listingCategoryId: undefined,
      permit_number: undefined,
      dealType: undefined,
      publish_to_marketplace: false,
      max_price: undefined,
      price_unit: "",
      price_type: "FLAT",
      price: undefined,
      has_parking: false,
      distress: false,
      negotiable: false,
      publish_to_website: false,
      details_on_request: false,
      property_bedroom: undefined,
      property_bathroom: undefined,
      property_size: undefined,
      amenities: [],
      visibility_scope: "PUBLIC",
      description:""
      // options: [],
    },
  });

  const { mutateAsync: submit, isPending } = useMutation({
    mutationFn: (credentials: any) =>
      axiosAuth.patch(`/listing/${id}`, credentials),
    onSuccess: (res) => {
      if (res?.data?.success) {
        toast("Success", { description: "Listing updated successfully." });
        queryClient.invalidateQueries({ queryKey: ["listing"] });
      }
    },
  });

  const { data: amenities, isLoading: gettingAmenities } = useQuery({
    queryKey: ["amenities"],
    queryFn: async () => {
      const res = await axiosAuth.get("/amenity");
      const result = res?.data?.data;
      return result;
    },
  });

  const fetchData = async (endpoint: string) => {
    const response = await axiosAuth.get(endpoint);
    return response.data.data;
  };

  const { data: customFields, isLoading: gettingCustomFields } = useQuery({
    queryKey: ["custom-fields", "listing"],
    queryFn: async () =>
      fetchData("/custom-settings?type=LISTING&section=BASIC_INFO"),
  });

  const { data: customFieldsExtra, isLoading: gettingCustomFieldsExtra } =
    useQuery({
      queryKey: ["custom-fields", "listing", "extra"],
      queryFn: async () =>
        fetchData("/custom-settings?type=LISTING&section=EXTRA_INFO"),
    });

  // const { data: status, isLoading: gettingStatus } = useQuery({
  //   queryKey: ["status"],
  //   queryFn: async () => fetchData("/leads/status/all"),
  // });

  const { isLoading: isLoadingCategory, data: allcategories } = useQuery({
    queryFn: async () => {
      const response = await axiosAuth.get("/listing-category");
      const results = response.data.data;
      return results;
    },
    queryKey: ["categories"],
  });

  const status = [
    "NEW",
    "HOT",
    "WARM",
    "COLD",
    "CONTACTED",
    "FOLLOW_UP",
    "INTERESTED",
    "QUALIFIED",
    "NOT_QUALIFIED",
    "VIEWING_SCHEDULED",
    "VIEWED",
    "OFFER_MADE",
    "NEGOTIATION",
    "BOOKED",
    "CLOSED_WON",
    "CLOSED_LOST",
    "UNRESPONSIVE",
    "DUPLICATE",
  ].map((status) => ({ id: status, title: status }));
  const gettingStatus = false;

  const { data: listing, isLoading: gettingListing } = useQuery({
    queryKey: [`listing`, id],
    queryFn: async () => {
      const res = await axiosAuth.get(`/listing/${id}`);
      const result = res.data.data;
      return result;
    },
  });

  useEffect(() => {
    if (listing) {
      form.reset({
        description: listing.description ?? "",
        title: listing.title ?? "",
        locationId: listing.locationId ?? "",
        projectId: String(listing.dxbProjectId) ?? "",
        category: listing.category?.listingCategoryId ?? "",
        listingCategoryId: listing.listingCategoryId ?? "",
        permit_number: listing.permit_number ?? "",
        dealType: listing.dealType ?? "SALE",
        price: listing.price ?? undefined,
        max_price: listing.max_price ?? undefined,
        price_unit: listing.price_unit ?? "",
        price_type: listing.price_type ?? "FLAT",
        property_bedroom: listing.property_bedroom ?? "",
        property_bathroom: listing.property_bathroom ?? "0",
        property_size: listing.property_size ?? undefined,
        has_parking: listing.has_parking ?? false,
        distress: listing.distress ?? false,
        negotiable: listing.negotiable ?? false,
        publish_to_website: listing.publish_to_website ?? false,
        publish_to_a2a_marketplace: listing.publish_to_a2a_marketplace ?? false,
        publish_to_marketplace: listing.publish_to_marketplace ?? false,
        details_on_request: listing.details_on_request ?? false,
        visibility_scope: listing.visibility_scope ?? "PUBLIC",
        amenities: listing.amenities ?? [],
      });
      setSelectedLocation(listing.location);
      setSelectedProject(listing.project);
      setFormFilled(true);
    }
  }, [listing, form.reset]);

  const onSubmit = async (values: any) => {
    try {
      await submit(values);
    } catch (err: any) {
      toast("Failed", {
        description: "Something went wrong. Please try again later",
      });
    }
  };

  const isLoading = gettingStatus;

  const {
    isLoading: isLoadingTeams,
    data: teammembers,
    isError,
  } = useQuery<TeamMember[]>({
    queryKey: ["team-members"],
    queryFn: async () => {
      const response = await axiosAuth.get("/users/team-members");
      const data = response.data?.data;
      return data;
    },
  });

  const modifiedAssignees = Array.isArray(teammembers)
    ? teammembers
      ?.filter((member) => member?.name != "")
      .map((assignee: any) => ({
        label: `${assignee?.name}`,
        value: assignee?.id,
      }))
    : [];

  return {
    onSubmit,
    form,
    status,
    isPending,
    isLoading,
    gettingCustomFields,
    customFields,
    customFieldsExtra,
    gettingCustomFieldsExtra,
    modifiedAssignees,
    formFilled,
    amenities,
    gettingAmenities,
    allcategories,
    selectedLocation,
    setSelectedLocation,
    selectedProject,
    setSelectedProject
  };
};

export default useUpdateListing;
