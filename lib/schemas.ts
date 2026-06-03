import * as z from "zod";

export const signupSchema = z.object({
  first_name: z
    .string({
      required_error: "First name is required.",
    })
    .min(2, {
      message: "First name must be at least 2 characters.",
    }),
  last_name: z
    .string({
      required_error: "Last name is required.",
    })
    .min(2, {
      message: "Last name must be at least 2 characters.",
    }),
  // company_name: z.string({
  //   required_error: "Company name is required.",
  // }).min(2, {
  //   message: "Company name must be at least 2 characters.",
  // }),
  // phone: z.string().optional(),
  password: z
    .string({
      required_error: "Please choose your password.",
    })
    .min(5, {
      message: "Password must be at least 5 characters.",
    })
    .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/, {
      message:
        "Password must contain at least one uppercase letter, one number, and one special character.",
    }),
  email: z
    .string({
      required_error: "Email is required.",
    })
    .email({
      message: "Please enter a valid email address.",
    }),
});

export const companySchema = z.object({
  company_name: z
    .string({
      required_error: "Company name is required.",
    })
    .min(2, {
      message: "Company name must be at least 2 characters.",
    }),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters." }),
});

export const accountsetupSchema = z.object({
  first_name: z.string().min(2, {
    message: "Please enter your firstname",
  }),
  last_name: z.string().min(2, {
    message: "Please enter your lastname",
  }),
  password: z
    .string({
      required_error: "Please choose your password.",
    })
    .min(5, {
      message: "Password must be at least 5 characters.",
    })
    .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/, {
      message:
        "Password must contain at least one uppercase letter, one number, and one special character.",
    }),
});

export const inviteSchema = z.object({
  invites: z.array(
    z.object({
      email: z.string().email(),
      roleId: z.union([z.string(), z.null()]),
    }),
  ),
});
export const inviteLandSchema = z.object({
  landlords: z.array(
    z.object({
      email: z.string().email(),
    }),
  ),
});

export const EditCampaignSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  location: z.string().optional(),
  caption: z
    .string()
    .min(2, { message: "Caption must be at least 2 characters." }),
  pixel_id: z.string().optional(),
  google_tag_id: z.string().optional(),
  starting_price: z
    .preprocess(
      (value) => Number(value),
      z.number().positive({ message: "Price must be a positive number" }),
    )
    .refine((val) => !isNaN(val), {
      message: "Price must be a valid number",
    }),
  amenities: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
  status: z.string().optional(),
  content: z.string().optional(),
  meta_keywords: z.string().optional(),
  meta_description: z.string().optional(),
  project_details: z.string().optional(),
  campaignTemplateId: z.string().optional(),
  slug: z.string().optional(),
});

export const ListCampaignSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  caption: z
    .string()
    .min(2, { message: "Caption must be at least 2 characters." }),
  pixel_id: z.string().optional(),
  google_tag_id: z.string().optional(),
  starting_price: z
    .preprocess(
      (value) => Number(value),
      z.number().positive({ message: "Price must be a positive number" }),
    )
    .refine((val) => !isNaN(val), {
      message: "Price must be a valid number",
    }),
  created_on: z.string().optional(),
  id: z.string(),
  amenities: z.string().optional(),
  status: z.string().optional(),
  content: z.string().optional(),
  meta_keywords: z.string().optional(),
  meta_description: z.string().optional(),
  project_details: z.string().optional(),
  campaignTemplateId: z.string().optional(),
});

export const createCampaignSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  location: z.string().optional(),
  caption: z
    .string()
    .min(2, { message: "Caption must be at least 2 characters." }),
  pixel_id: z.string().optional(),
  google_tag_id: z.string().optional(),
  starting_price: z
    .preprocess(
      (value) => Number(value),
      z.number().positive({ message: "Price must be a positive number" }),
    )
    .refine((val) => !isNaN(val), {
      message: "Price must be a valid number",
    }),
  amenities: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
  status: z.string().optional(),
  content: z.string().optional(),
  meta_keywords: z.string().optional(),
  meta_description: z.string().optional(),
  project_details: z.string().optional(),
  campaignTemplateId: z.string().optional(),
});

export const customFieldSchema = z.object({
  // type: z.enum(["LEAD", "LISTING"]),
  section: z.enum(["BASIC_INFO", "EXTRA_INFO"]),
  label: z.string().min(2, {
    message: "Please specify a label",
  }),
  input_type: z.enum([
    "TEXTBOX",
    "TEXTAREA",
    "MULTI_CHOICE",
    "SINGLE_CHOICE",
    "COUNTRY",
    "LANGUAGE",
  ]),
  placeholder: z.string(),
  options: z.array(
    z.object({
      option: z.string(),
    }),
  ),
  required: z.boolean().optional(),
});

export const roleSchema = z.object({
  name: z
    .string({
      required_error: "Role name is required.",
    })
    .min(2, {
      message: "Role name must be at least 2 characters.",
    })
    .max(50, {
      message: "Role name must not exceed 50 characters.",
    })
    .regex(/^[a-zA-Z0-9\s\-_&]+$/, {
      message:
        "Role name can only contain letters, numbers, spaces, hyphens, underscores, and ampersands.",
    })
    .trim(),
  role_description: z
    .string({
      required_error: "Role description is required.",
    })
    .min(10, {
      message: "Role description must be at least 10 characters.",
    })
    .max(500, {
      message: "Role description must not exceed 500 characters.",
    })
    .trim(),
});
export const teamMemberSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  role: z.string(),
  status: z.string(),
  user_type: z.string(),
  avatar: z.string(),
});
export const EditTeamMembersSchema = z.object({
  email: z.string().email(),
  role: z.string(),
});

export const sampleSchema = z.object({
  lead_firstname: z
    .string()
    .min(2, { message: "First Name must be at least 2 characters." }),

  lead_lastname: z
    .string()
    .min(2, { message: "Last Name must be at least 2 characters." }),

  lead_email: z
    .string()
    // .email({ message: "Please enter a valid email address." })
    .optional(),

  lead_phone: z.string(),
  // .regex(/^\+?[0-9]{10,15}$/, {
  //   message: "Invalid phone number format.",
  // })
  // .min(10, { message: "Phone number must be at least 10 digits." })
  // .max(15, { message: "Phone number cannot exceed 15 digits." }),

  lead_categoryid: z.number({
    required_error: "Please select a categories.",
  }),

  source: z.string({ required_error: "Please select a source." }),

  lead_title: z
    .string()
    .min(2, { message: "Lead Title must be at least 2 characters." }),

  lead_value: z.preprocess((value) => Number(value), z.number()).optional(),

  lead_status: z.number({ required_error: "Please select status." }),
  assign: z
    .array(z.number().min(1))
    .min(1)
    .nonempty("Please select at least one option."),
  client_type: z.string().optional(),

  language: z.string().optional(),

  interest: z.string().optional(),
  property_type: z.string().optional(),

  flag: z.string().optional(),

  lead_type: z.string().optional(),
});

export const basicLeadSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Subject must be at least 2 characters." }),
  full_name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." }),
  email: z
    .string()
    .email({ message: "Please enter a valid email address." })
    .optional(),

  phone: z.string().optional(),
  source: z.string().optional(),
  lead_status: z.string({ required_error: "Please select status." }).optional(),
  options: z.array(
    z.object({
      option: z.any(),
      id: z.string(),
    }),
  ),
});

export const basicListingSchema = z.object({
  // title: z.string().min(2, { message: "Title/Caption must be at least 2 characters." }),
  title: z.string().optional(),
  
  description: z.string().optional(),

  email: z.string().email().optional(),

  phone: z.string().optional(),

  publish_to_website: z.boolean().optional(),

  locationId: z.string(),
  projectId: z.string().optional(),

  category: z.string({ required_error: "Category is required." }),

  listingCategoryId: z.string().optional(),

  permit_number: z.string().optional(),

  dealType: z.enum(["SALE", "RENT"]),

  publish_to_a2a_marketplace: z.boolean().optional(),
  publish_to_marketplace: z.boolean().optional(),

  price: z
    .preprocess((val) => {
      if (val === "" || val === undefined || val === null) return undefined;
      return Number(val);
    }, z.number().positive())
    .optional(),

  max_price: z
    .preprocess((val) => {
      if (val === "" || val === undefined || val === null) return undefined;
      return Number(val);
    }, z.number())
    .optional(),

  price_unit: z.string().optional(),

  price_type: z.enum(["FLAT", "RANGE", "DISABLED"]),
  visibility_scope: z.enum(["PUBLIC", "PRIVATE"]).optional(),

  has_parking: z.boolean().optional(),

  distress: z.boolean().optional(),

  negotiable: z.boolean().optional(),
  visibility_team_only: z.boolean().optional(),
  details_on_request: z.boolean().optional(),

  property_bedroom: z.string({ required_error: "Bedroom is required." }),

  property_bathroom: z.string().optional(),

  property_size: z
    .preprocess((val) => {
      if (val === "" || val === undefined || val === null) return undefined;
      return Number(val);
    }, z.number())
    .optional(),

  amenities: z
    .array(z.string())
    .optional()
    .refine((tags) => !tags || new Set(tags).size === tags.length, {
      message: "Duplicate amenities are not allowed",
    }),

  // options: z.array(
  //   z.object({
  //     option: z.string(),
  //     id: z.string(),
  //   }),
  // ),
});

export const ListingInquirySchema = z.object({
  name: z.string().min(2),

  note: z.string().min(2),

  locationId: z.string(),

  Category: z.string().min(1),

  SubCategory: z.string().optional(),

  dealType: z.enum(["SALE", "RENT"]),

  publish_to_marketplace: z.boolean().optional(),

  min_budget: z
    .preprocess((val) => {
      if (val === "" || val === undefined || val === null) return undefined;
      return Number(val);
    }, z.number().positive())
    .optional(),

  max_budget: z
    .preprocess((val) => {
      if (val === "" || val === undefined || val === null) return undefined;
      return Number(val);
    }, z.number())
    .optional(),

  distres: z.boolean().optional(),

  completionStatus: z.string(),

  property_bedroom: z.string(),
  property_bathroom: z.string(),

  furnished: z.boolean().optional(),

  size: z.string().optional(),
});

export const leadSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Subject must be at least 2 characters." }),
  full_name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." }),
  email: z
    .string()
    .email({ message: "Please enter a valid email address." })
    .optional(),
  phone: z.string().optional(),
  source: z.string().optional(),
  lead_status: z.string({ required_error: "Please select status." }).optional(),
  options: z.array(
    z.object({
      option: z.string(),
      id: z.string(),
    }),
  ),
  assigned_to: z.array(z.string()).optional(),
});

export const leadStatusSchema = z.object({
  options: z.array(
    z.object({
      label: z.string().min(1, "Status label is required"),
      color: z.string().optional(),
    }),
  ),
});

export const leadSourceSchema = z.object({
  options: z.array(
    z.object({
      label: z.string().min(1, "Source label is required"),
    }),
  ),
});

export const mediaSchema = z.object({
  images: z.array(z.instanceof(File)).optional(),
});

export const extraLeadSchema = z.object({
  lead_value: z.preprocess((value) => Number(value), z.number()).optional(),

  client_type: z.string().optional(),

  language: z.string().optional(),

  interest: z.string().optional(),

  property_type: z.string().optional(),

  flag: z.string().optional(),

  lead_type: z.string().optional(),

  project_name: z.string().optional(),

  additional_client_phone: z.string().optional(),

  additional_client_email: z.string().optional(),
});

export const ticketSchema = z.object({
  subject: z
    .string()
    .min(2, { message: "Subject must be at least 2 characters." }),

  message: z
    .string()
    .min(2, { message: "Content must be at least 2 characters." }),
  assigned_to_role: z.array(z.string()).optional(),

  assigned_to: z.array(z.string()).optional(),
  priority: z.enum(["low", "medium", "high"], {
    required_error: "Priority is required",
  }),
  assigned_to_type: z.enum(["INDIVIDUAL", "ROLE"], {
    required_error: "assign to type is required",
  }),
});

export const watermarkSchema = z
  .object({
    type: z.enum(["IMAGE", "TEXT"]),
    image: z.any().optional(),
    text: z.string().optional(),
    opacity: z.number().min(0).max(1),
    scale: z.number().min(0.1).max(1),
    position: z.string(),
    color: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.type === "IMAGE") {
      if (!data.image || !(data.image instanceof File)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Watermark image is required",
          path: ["image"],
        });
      }
    }

    if (data.type === "TEXT") {
      if (!data.text || data.text.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Watermark text is required",
          path: ["text"],
        });
      }
    }
  });

export const commentSchema = z.object({
  comment: z.string(),
  // resource_type: z.enum(['LEAD', 'LISTING', 'TICKET'])
});

export const dncrSchema = z.object({
  connector_type: z.literal("DNCR"),
  numbers: z
    .array(
      z.string().min(9, { message: "Each number must be at least 9 digits." }),
    )
    .optional(),
});

export const locationSchema = z.object({
  name: z.string().min(2, {
    message: " Name must be at least 2 characters.",
  }),
  slug: z.string().min(2, {
    message: "Slug must be at least 2 characters.",
  }),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),

  parent: z.number({ required_error: "Please select location." }),
});

export const contactSchema = z.object({
  interest: z.string().optional(),
  full_name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." }),
  description: z.string().optional(),
  phone: z
    .string()
    .regex(/^\+\d{7,14}$/)
    .optional(),
  whatsapp: z.string().optional(),
  email: z.string().email().optional(),
  tags: z
    .array(z.string().trim().min(2, "Tag too short").max(20, "Tag too long"))
    .default([])
    .refine((tags) => new Set(tags).size === tags.length, {
      message: "Duplicate tags are not allowed",
    }),
});

export const dncrConnectorSchema = z.object({
  connector_type: z.literal("DNCR"),
  client_id: z.string().min(2, {
    message: " Name must be at least 2 characters.",
  }),
  client_secret: z.string().min(2, {
    message: " Name must be at least 2 characters.",
  }),
});

export const dxbProjectSchema = z.object({
  project_number: z.number({
    required_error: "Project number is required.",
  }),
  project_name: z
    .string()
    .min(2, { message: "Project name must be at least 2 characters." }),
  project_name_en: z
    .string()
    .min(2, { message: "English project name must be at least 2 characters." }),
  developer_id: z.number({
    required_error: "Developer ID is required.",
  }),
  developer_name: z.string().optional(),
  developer_name_en: z.string().optional(),
  master_developer_id: z.number().optional(),
  master_developer_name: z.string().optional(),
  project_start_date: z.string().optional(),
  project_end_date: z.string().optional(),
  project_type_id: z.number().optional(),
  project_classification_id: z.number().optional(),
  escrow_agent_id: z.number().optional(),
  escrow_agent_name: z.string().optional(),
  project_status: z.enum(["ACTIVE", "FINISHED", "CANCELLED", "ON_HOLD"], {
    required_error: "Project status is required.",
  }),
  percent_completed: z.number().min(0).max(100).default(0),
  completion_date: z.string().optional(),
  cancellation_date: z.string().optional(),
  project_description_ar: z.string().optional(),
  project_description_en: z.string().optional(),
  property_id: z.number().optional(),
  area_id: z.number().optional(),
  area_name_en: z.string().optional(),
  master_project_ar: z.string().optional(),
  master_project_en: z.string().optional(),
  zoning_authority_id: z.number().optional(),
  zoning_authority_en: z.string().optional(),
  no_of_lands: z.number().default(0),
  no_of_buildings: z.number().default(0),
  no_of_villas: z.number().default(0),
  no_of_units: z.number().default(0),
  images: z.array(z.any()).optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});

export const dxbTransactionSchema = z.object({
  transaction_id: z.string().min(1, { message: "Transaction ID is required." }),
  trans_group_en: z
    .string()
    .min(1, { message: "Transaction group is required." }),
  procedure_name_en: z
    .string()
    .min(1, { message: "Procedure name is required." }),
  instance_date: z.string().min(1, { message: "Instance date is required." }),
  property_type_en: z
    .string()
    .min(1, { message: "Property type is required." }),
  property_sub_type_en: z.string().optional(),
  property_usage_en: z.string().optional(),
  reg_type_en: z.string().optional(),
  area_name_en: z.string().optional(),
  building_name_en: z.string().optional(),
  project_number: z.number().optional(),
  project_name_en: z.string().optional(),
  master_project_en: z.string().optional(),
  nearest_metro_en: z.string().optional(),
  nearest_mall_en: z.string().optional(),
  rooms_en: z.string().optional(),
  has_parking: z.number().min(0).max(1).default(0),
  procedure_area: z
    .number()
    .min(0, { message: "Procedure area must be positive." }),
  actual_worth: z
    .number()
    .min(0, { message: "Actual worth must be positive." }),
  meter_sale_price: z.number().min(0).optional(),
  rent_value: z.number().min(0).optional(),
  meter_rent_price: z.number().min(0).optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});

export const propertySchema = z.object({
  address: z
    .string()
    .min(2, { message: "Address must be at least 2 characters." }),
  description: z.string().optional(),
  location: z.string().optional(),
  // location: z.number({ required_error: "Please select location." }),
  landlord: z
    .object({
      id: z.string().optional(),
      email: z.string().optional(),
    })
    .optional(),
  units: z.array(
    z.object({
      name: z.string().min(1, "Unit name is required"),
      description: z.string().optional(),
    }),
  ),
});

export const assignInventorySchema = z.object({
  assigned_to: z.number({
    required_error: "Please select a user.",
  }),
});

export const tenantSchema = z.object({
  property: z.string().optional(),
  // property: z.number({ required_error: "Please select a property." }),
  unitId: z.string({ required_error: "Please select a unit." }),
  tenants: z.array(
    z.object({
      full_name: z.string().min(1, "Fullname is required"),
      email: z.string().email("Invalid email"),
      phone: z.string().min(1, "Phone is required"),
    }),
  ),
});

export const inventorySchema = z.object({
  images: z.array(z.instanceof(File)).optional(),
  attachments: z.array(z.instanceof(File)).optional(),
  add_to_mail_list: z.boolean().optional(),
  permitImage: z.instanceof(File).optional(),
  ad_type: z.string().min(1, { message: "Ad type is required." }),
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  rtcl_listing_pricing: z.enum(["price", "range", "disabled"], {
    required_error: "You need to select a type.",
  }),
  pricing: z.string({ required_error: "Please select option." }),
  property_status: z.string({ required_error: "Please select option." }),
  has_parking: z.enum(["yes", "no"], {
    required_error: "You need to select.",
  }),
  distress: z.enum(["yes", "no"]).optional(),
  is_exclusive: z.string().optional(),
  price: z
    .preprocess(
      (value) => Number(value),
      z.number().positive({ message: "Price must be a positive number" }),
    )
    .refine((val) => !isNaN(val), {
      message: "Price must be a valid number",
    }),
  max_price: z
    .preprocess((value) => Number(value), z.number())
    .refine((val) => !isNaN(val), {
      message: "Max Price must be a valid number",
    })
    .optional(),
  price_unit: z.string().min(1, { message: "Price type is required." }),
  category: z.number({
    required_error: "Please select a category.",
  }),
  listingCategoryId: z
    .number({
      required_error: "Please select a sub category.",
    })
    .optional(),
  amenities: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
  property_bedroom: z.string({ required_error: "Please select option." }),
  property_bathroom: z.string({ required_error: "Please select option." }),
  property_size: z
    .preprocess((value) => Number(value), z.number())
    .refine((val) => !isNaN(val), {
      message: "Property size must be a valid number",
    })
    .optional(),
  property_year: z
    .string({ message: "Please enter building year." })
    .optional(),
  phone: z.string({ message: "Please enter clients phone number." }),
  whatsapp: z.string().optional(),
  // permit_number: z.string({ message: "Please enter permit number." }),
  permit_number: z.string().optional(),
  unit_number: z.string({ message: "Please enter permit number." }).optional(),
  status: z.string({ required_error: "Please select option." }),
  location: z.number({ required_error: "Please select location." }),
  assigned_to: z.string({
    required_error: "Please select a option.",
  }),
  content: z.string().optional(),
  note: z.string().optional(),
  public: z.boolean(),
});

export const chargeSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  type: z.enum(["ONE_OFF", "RECURRING"], {
    required_error: "Please select a charge type.",
  }),
});

export const rentSchema = z.object({
  property: z.string({ required_error: "Please select a property." }),
  unit: z.string({ required_error: "Please select a unit." }),
  excludes: z.array(z.string()).optional(),
  charges: z
    .array(
      z.object({
        id: z.string({ required_error: "Please select a charge." }),
        rent_amount: z
          .preprocess((value) => Number(value), z.number().positive())
          .refine((val) => !Number.isNaN(val), {
            message: "Collection amount must be a valid number.",
          }),
        start_date: z.string({ required_error: "Start date is required." }),
        end_date: z.string({ required_error: "End date is required." }),
      }),
    )
    .min(1, { message: "Please add at least one charge row." }),
  remind: z.boolean().optional(),
  send_reminder: z.enum(["DUE_DATE", "DUE_IN", "LATE"]).optional(),
  send_reminder_every: z.string().optional(),
  send_reminder_period: z.enum(["d", "w"]).optional(),
  notify: z.enum(["once", "again"]).optional(),
});

export const propertyContactSchema = z.object({
  message: z.string(),
});
export const propertyContactReviewSchema = z.object({
  closed: z.string(),
  message: z.string().optional(),
});
