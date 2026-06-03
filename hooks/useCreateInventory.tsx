"use client";
import { inventorySchema } from "@/lib/schemas";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import useAxiosAuth from "./useAxiosAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useDropzone } from "react-dropzone";

type FormData = z.infer<typeof inventorySchema>;

const useCreateInventory = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const axiosAuth = useAxiosAuth();
  const [modifiedCategoryData, setModifiedCategoryData] = useState<any[]>([]);
  const [modifiedSubCategory, setModifiedSubCategory] = useState<any[]>([]);
  const [preview, setPreview] = useState<string[]>([]);
  const [previewAttach, setPreviewAttach] = useState<string[]>([]);
  const [permit, setPermit] = useState<string | ArrayBuffer | null>("");

  const form = useForm<FormData>({
    resolver: zodResolver(inventorySchema),
    defaultValues: {
      ad_type: "",
      title: "",
      rtcl_listing_pricing: undefined,
      price: undefined,
      distress: "no",
      max_price: undefined,
      price_unit: "",
      category: undefined,
      listingCategoryId: undefined,
      add_to_mail_list: false,
      amenities: [],
      property_bedroom: undefined,
      property_bathroom: undefined,
      property_size: undefined,
      permit_number: undefined,
      unit_number: undefined,
      status: undefined,
      pricing: undefined,
      property_status: undefined,
      has_parking: undefined,
      is_exclusive: undefined,
      property_year: undefined,
      location: undefined,
      whatsapp: undefined,
      phone: undefined,
      assigned_to: session?.user.id || undefined,
      images: [],
      attachments: [],
      permitImage: undefined,
      // permitImage: new File([""], "filename"),
      content: "",
      note: "",
      public: false,
    },
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const previews: string[] = [];

      try {
        acceptedFiles.forEach((file) => {
          const reader = new FileReader();
          reader.onload = () => {
            previews.push(reader.result as string);
            setPreview([...previews]);
          };
          reader.readAsDataURL(file);
        });

        form.setValue("images", acceptedFiles);
        form.clearErrors("images");
      } catch (error) {
        setPreview([]);
        form.resetField("images");
      }
    },
    [form],
  );
  const attachOnDrop = useCallback(
    (acceptedFiles: File[]) => {
      const previews: string[] = [];

      try {
        acceptedFiles.forEach((file) => {
          const reader = new FileReader();
          reader.onload = () => {
            previews.push(reader.result as string);
            setPreviewAttach([...previews]);
          };
          reader.readAsDataURL(file);
        });

        form.setValue("attachments", acceptedFiles);
        form.clearErrors("attachments");
      } catch (error) {
        setPreviewAttach([]);
        form.resetField("attachments");
      }
    },
    [form],
  );
  const permitOnDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      const reader = new FileReader();
      try {
        reader.onload = () => setPermit(reader.result);
        reader.readAsDataURL(acceptedFiles[0]);
        form.setValue("permitImage", acceptedFiles[0]);
        form.clearErrors("permitImage");
      } catch (error) {
        setPermit(null);
        form.resetField("permitImage");
      }
    },
    [form],
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept: {
        "image/png": [],
        "image/jpg": [],
        "image/jpeg": [],
      },
    });

  const {
    getRootProps: permitGetRootProps,
    getInputProps: permitGetInputProps,
    isDragActive: permitIsDragActive,
    fileRejections: permitFileRejections,
  } = useDropzone({
    onDrop: permitOnDrop,
    maxFiles: 1,
    maxSize: 1000000,
    accept: { "image/png": [], "image/jpg": [], "image/jpeg": [] },
  });

  const {
    getRootProps: attachGetRootProps,
    getInputProps: attachGetInputProps,
    isDragActive: attachIsDragActive,
    fileRejections: attachFileRejections,
  } = useDropzone({
    onDrop: attachOnDrop,
    maxSize: 1000000,
    accept: { "image/png": [], "image/jpg": [], "image/jpeg": [] },
  });

  const fetchData = useCallback(
    async (endpoint: string) => {
      const response = await axiosAuth.get(endpoint);
      return response.data.data.customfields_datapayload
        ? JSON.parse(response.data.data.customfields_datapayload)
        : response.data.data;
    },
    [axiosAuth],
  );

  const queries = {
    priceTypes: useQuery({
      queryKey: ["priceTypes"],
      queryFn: () => fetchData("/list/pricings/all"),
    }),
    unitTypes: useQuery({
      queryKey: ["unitTypes"],
      queryFn: () => fetchData("/list/unit_types/all"),
    }),
    // adTypes: useQuery({
    //   queryKey: ["adTypes"],
    //   queryFn: () => fetchData("/list/ad_types/all"),
    // }),
    // propertyStatus: useQuery({
    //   queryKey: ["propertyStatus"],
    //   queryFn: () => fetchData("/list/property_status/all"),
    // }),
    categories: useQuery({
      queryKey: ["listCategories"],
      queryFn: () => fetchData("/list/categories/all"),
    }),
    amenities: useQuery({
      queryKey: ["amenities"],
      queryFn: () => fetchData("/list/amenities/all"),
    }),
    locations: useQuery({
      queryKey: ["allLocations"],
      queryFn: async () => {
        const res = await axiosAuth.get(`/locations`);
        return res.data.data;
      },
    }),
    assignees: useQuery({
      queryKey: ["assignees"],
      queryFn: () => fetchData("/users/assignees"),
    }),
  };

  const transformedData = useMemo(
    () => ({
      assignees: queries.assignees.data?.users.map((assignee: any) => ({
        label: `${assignee?.first_name} ${assignee?.last_name}`,
        value: assignee?.id,
      })),
      unitTypes: queries.unitTypes.data?.map((unite: any) => ({
        id: unite.id || "no-unit",
        name: unite.name,
      })),
    }),
    [queries.assignees.data, queries.unitTypes.data],
  );

  const { mutateAsync: submit, isPending } = useMutation({
    mutationFn: (credentials: any) =>
      axiosAuth.post("/list", credentials, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
    onSuccess: (res) => {
      if (res?.data?.status === "success") {
        toast("Success", { description: "Inventory created successfully." });
        form.reset();
        router.push(
          res.data.data.data.slug
            ? `/inventories/${res.data.data.data.slug}`
            : "/inventories",
        );
      }
    },
  });

  const status = [
    { value: "pending", label: "List Only" },
    { value: "publish", label: "Published" },
  ];

  useEffect(() => {
    const { ad_type, category } = form.getValues();
    // const categories = queries.categories.data?.categories_with_adtypes || [];
    const categories = [
      {
        term_id: 112,
        name: "Apartment",
        slug: "apartment",
        term_group: 0,
        status: "active",
        description: "",
        parent: 243,
        ad_types: ["buy", "rent"],
      },
      {
        term_id: 474,
        name: "Building",
        slug: "building",
        term_group: 0,
        status: "active",
        description: "Building",
        parent: 243,
        ad_types: ["buy", "rent"],
      },
      {
        term_id: 246,
        name: "Bungalow",
        slug: "bungalow",
        term_group: 0,
        status: "active",
        description: "",
        parent: 243,
        ad_types: ["buy", "rent"],
      },
      {
        term_id: 126,
        name: "Commercial",
        slug: "commercial",
        term_group: 0,
        status: "active",
        description: "Commercial Properties",
        parent: 0,
        ad_types: ["buy", "rent", "off_plan"],
      },
      {
        term_id: 449,
        name: "Commercial Villa",
        slug: "villa-commercial",
        term_group: 0,
        status: "active",
        description: "",
        parent: 126,
        ad_types: ["buy", "rent", "off_plan", "off_plan_featured"],
      },
      {
        term_id: 475,
        name: "Labour Camp",
        slug: "labour-camp",
        term_group: 0,
        status: "active",
        description: "Labourcamp",
        parent: 243,
        ad_types: ["rent", "buy"],
      },
      {
        term_id: 248,
        name: "Land",
        slug: "land",
        term_group: 0,
        status: "active",
        description: "Land",
        parent: 0,
        ad_types: ["buy", "rent"],
      },
      {
        term_id: 265,
        name: "Mixed",
        slug: "mixed-residential-commercial",
        term_group: 0,
        status: "active",
        description: "Mixed (Residential &amp; Commercial)",
        parent: 0,
        ad_types: ["buy", "off_plan", "off_plan_featured"],
      },
      {
        term_id: 162,
        name: "Office",
        slug: "office",
        term_group: 0,
        status: "active",
        description: "",
        parent: 126,
        ad_types: ["buy", "rent", "off_plan"],
      },
      {
        term_id: 245,
        name: "Penthouse",
        slug: "penthouse",
        term_group: 0,
        status: "active",
        description: "",
        parent: 243,
        ad_types: ["buy", "rent"],
      },
      {
        term_id: 243,
        name: "Residential",
        slug: "residential",
        term_group: 0,
        status: "active",
        description: "Residential Properties",
        parent: 0,
        ad_types: ["buy", "rent", "off_plan"],
      },
      {
        term_id: 204,
        name: "Restaurant",
        slug: "restaurant",
        term_group: 0,
        status: "active",
        description: "",
        parent: 126,
        ad_types: ["buy", "rent", "off_plan"],
      },
      {
        term_id: 250,
        name: "Shop",
        slug: "shop",
        term_group: 0,
        status: "active",
        description: "",
        parent: 126,
        ad_types: ["buy", "rent", "off_plan"],
      },
      {
        term_id: 244,
        name: "Townhouse",
        slug: "townhouse",
        term_group: 0,
        status: "active",
        description: "",
        parent: 243,
        ad_types: ["buy", "rent"],
      },
      {
        term_id: 75,
        name: "Villa",
        slug: "villa",
        term_group: 0,
        status: "active",
        description: "",
        parent: 243,
        ad_types: ["buy", "rent"],
      },
      {
        term_id: 247,
        name: "Warehouse",
        slug: "warehouse",
        term_group: 0,
        status: "active",
        description: "",
        parent: 126,
        ad_types: ["buy", "rent", "off_plan"],
      },
    ];

    const modifiedCategory = categories.filter(
      (cat: any) => cat.parent === 0 && cat.ad_types.includes(ad_type),
    );

    const modifiedSub = categories.filter((c: any) => c.parent === category);

    setModifiedSubCategory(modifiedSub);
    setModifiedCategoryData(modifiedCategory);
  }, [form.watch("ad_type"), form.watch("category"), queries.categories.data]);

  const onSubmit = async (values: FormData) => {
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("ad_type", values.ad_type);
      formData.append(
        "rtcl_listing_pricing",
        values.rtcl_listing_pricing?.toString(),
      );
      formData.append("price", values.price?.toString());
      formData.append("max_price", values.max_price?.toString() ?? "");
      formData.append("price_unit", values.price_unit);
      formData.append("property_status", values?.property_status);
      formData.append("category", values.category?.toString());
      formData.append(
        "listingCategoryId",
        values.listingCategoryId?.toString() ?? "",
      );
      formData.append("property_bedroom", values.property_bedroom?.toString());
      formData.append(
        "property_bathroom",
        values.property_bathroom?.toString(),
      );
      formData.append("property_size", values?.property_size?.toString() || "");
      formData.append("permit_number", values.permit_number || "");
      formData.append("unit_number", values?.unit_number || "");
      formData.append("status", values.status);
      formData.append("pricing", values.pricing);
      formData.append("has_parking", values.has_parking);
      formData.append("distress", values?.distress || "");
      formData.append("property_year", values?.property_year?.toString() || "");
      formData.append("location", values.location?.toString());
      formData.append("assigned_to", values.assigned_to?.toString());
      formData.append("phone", values?.phone || "");
      formData.append("whatsapp", values?.whatsapp || "");
      formData.append("is_exclusive", values?.is_exclusive || "");
      formData.append("content", values?.content || "");
      formData.append("note", values?.note || "");

      // Serialize and append arrays
      formData.append("amenities", JSON.stringify(values.amenities || []));

      if (Array.isArray(values.images)) {
        values.images.forEach((image: File) => {
          formData.append("images", image);
        });
      }

      if (Array.isArray(values.attachments)) {
        values.attachments.forEach((attachment: File) => {
          formData.append("attachments", attachment);
        });
      }

      // Append permit image directly
      if (values.permitImage instanceof File) {
        formData.append("permitImage", values.permitImage);
      } else {
        formData.append("permitImage", "");
      }
      await submit(formData);
    } catch (err: any) {
      toast("Failed", {
        description: "Something went wrong. Please try again later",
      });
    }
  };

  const adTypes = [
    {
      name: "Buy",
      slug: "buy",
      id: 1,
    },
    {
      name: "Rent",
      slug: "rent",
      id: 2,
    },
    {
      name: "Off-Plan",
      slug: "off_plan",
      id: 3,
    },
  ];

  const isLoading = Object.values(queries).some((query) => query.isLoading);

  return {
    adTypes,
    form,
    status,
    isLoading,
    onSubmit,
    isPending,
    ...queries,
    modifiedCategoryData,
    modifiedSubCategory,
    modifiedAssignees: transformedData.assignees,
    modifiedUnit: transformedData.unitTypes,
    getRootProps,
    getInputProps,
    isDragActive,
    fileRejections,
    preview,
    attachOnDrop,
    permitOnDrop,
    permit,
    permitFileRejections,
    permitGetRootProps,
    permitGetInputProps,
    previewAttach,
    permitIsDragActive,
    attachFileRejections,
    attachGetRootProps,
    attachGetInputProps,
    attachIsDragActive,
  };
};

export default useCreateInventory;
