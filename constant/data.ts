import { NavItem, NavGroup } from "@/types";

export const navGroups: NavGroup[] = [
  {
    // label: "General",
    items: [
      {
        pages: "*",
        title: "Home",
        url: "/home",
        icon: "house",
        isActive: false,
        items: [],
      },
      {
        pages: ["role_inbox"],
        title: "Inbox",
        url: "/inbox",
        icon: "envelopearrowdown",
        isActive: false,
        items: [],
      },
    ],
  },
  {
    label: "Leads & Sales",
    items: [
      {
        pages: ["role_leads", "role_leads_all", "role_leads_add", "role_leads_settings"],
        title: "Leads",
        url: "/leads",
        icon: "personvcard",
        isActive: false,
        items: [
          {
            pages: ["role_leads"],
            title: "My Leads",
            url: "/leads",
            icon: "personvcard",
          },
          // {
          //   pages: ["role_leads_all"],
          //   title: "All Leads",
          //   url: "/leads/all",
          //   icon: "role",
          // },
          {
            pages: ["role_leads_add"],
            title: "New Lead",
            url: "/leads/new",
            icon: "add",
          },
          {
            pages: ["role_leads_settings"],
            title: "Settings",
            url: "/leads/settings",
            icon: "settings",
          },
          {
            pages: ["role_leads_add"],
            title: "Import Leads",
            url: "/leads/import",
            icon: "upload",
          },
        ],
      },
      {
        pages: ["role_property_listing", "role_property_listing_add"],
        title: "Property Listings",
        url: "property-listings",
        icon: "bank",
        isActive: false,
        items: [
          {
            pages: ["role_property_listing"],
            title: "A2A Marketplace",
            url: "/property-listings/search",
            icon: "bank",
          },
          {
            pages: ["role_property_listing"],
            title: "Contacted",
            url: "/property-listings/contacted",
            icon: "clock",
          },
          {
            pages: ["role_property_listing"],
            title: "My Listings",
            url: "/property-listings",
            icon: "personcheck",
          },
          {
            pages: ["role_property_listing_add"],
            title: "Add Listing",
            url: "/property-listings/new",
            icon: "add",
          },
          {
            pages: ["role_property_listing"],
            title: "My Inquiries",
            url: "/property-listings/inquiry",
            icon: "personadd",
          },
          {
            pages: ["role_property_listing_add"],
            title: "Add Inquiry",
            url: "/property-listings/inquiry/new",
            icon: "add",
          },
          {
            pages: ["role_property_listing_add"],
            title: "Settings",
            url: "/property-listings/settings",
            icon: "settings",
          },
          {
            pages: ["role_property_listing_add"],
            title: "Import Listings",
            url: "/property-listings/import",
            icon: "upload",
          },
        ],
      },
      {
        pages: ["role_collections", "role_collections_add"],
        title: "Property Management",
        url: "/property-management",
        icon: "houses",
        isActive: false,
        items: [
          {
            pages: ["role_dxb_projects"],
            title: "Properties & Units",
            url: "/property-management/properties-units",
            icon: "role",
          },
          {
            pages: ["role_collections"],
            title: "Payment Collections",
            url: "/payment-collections",
            icon: "role",
          },
          {
            pages: ["role_collections"],
            title: "Charges & Fees",
            url: "/charges",
            icon: "role",
          },
          {
            pages: ["role_dxb_projects_add"],
            title: "Landlords",
            url: "/property-management/landlords",
            icon: "role",
          },
          {
            pages: ["role_collections_add"],
            title: "Tenants",
            url: "/property-management/tenants",
            icon: "role",
          },
        ],
      },
    ],
  },
  {
    label: "Explorer",
    items: [
      {
        pages: ["role_manage_approvals"],
        title: "DXB Projects",
        url: "/dxb-projects",
        icon: "buildings",
        isActive: false,
        items: [],
      },
      {
        pages: ["role_manage_approvals"],
        title: "DXB Transactions",
        url: "/dxb-transactions",
        icon: "arrowLeftRight",
        isActive: false,
        items: [],
      },
      {
        pages: ["role_manage_dncr"],
        title: "DNCR",
        url: "/dncr",
        icon: "phoneOutgoing",
        isActive: false,
        items: [
          {
            pages: ["role_invite_users"],
            title: "Recent Checks",
            url: "/dncr",
            icon: "phoneOutgoing",
          },
          {
            pages: ["role_invite_users"],
            title: "Check Numbers",
            url: "/dncr/check",
            icon: "search",
          },
          {
            pages: ["role_invite_users"],
            title: "API Settings",
            url: "/dncr/api-settings",
            icon: "settings",
          },
        ],
      },
    ],
  },
  {
    label: "Content & Marketing",
    items: [
      {
        pages: ["role_campaigns", "role_campaigns_add"],
        title: "Contacts",
        url: "clients",
        icon: "contact",
        isActive: false,
        items: [
          {
            pages: ["role_campaigns"],
            title: "All Contacts",
            url: "/contacts/all",
            icon: "contact",
          },
          {
            pages: ["role_campaigns"],
            title: "My Contacts",
            url: "/contacts",
            icon: "personadd",
          },
          {
            pages: ["role_campaigns_add"],
            title: "Add Contact",
            url: "/contacts/new",
            icon: "add",
          },
          {
            pages: ["role_campaigns_add"],
            title: "Import Contact",
            url: "/contacts/import",
            icon: "upload",
          },
        ],
      },
      {
        pages: ["role_campaigns", "role_campaigns_add"],
        title: "Campaigns",
        url: "campaigns",
        icon: "megaphone",
        isActive: false,
        items: [
          {
            pages: ["role_campaigns"],
            title: "All Campaigns",
            url: "/campaigns",
            icon: "megaphone",
          },
          {
            pages: ["role_campaigns_add"],
            title: "New Campaign",
            url: "/campaigns/new",
            icon: "add",
          },
        ],
      },
      {
        pages: ["role_media_library", "role_media_library_add"],
        title: "Media Library",
        url: "/media-library",
        icon: "collectionplay",
        isActive: false,
        items: [
          {
            pages: ["role_media_library"],
            title: "All Media",
            url: "/media-library",
            icon: "collectionplay",
          },
          {
            pages: ["role_media_library_add"],
            title: "Upload Media",
            url: "/media-library/new",
            icon: "upload",
          },
        ],
      },
    ],
  },
  {
    label: "Website",
    items: [
      {
        pages: "*",
        title: "Website",
        url: "/website",
        icon: "globe",
        isActive: false,
        items: [
          {
            pages: "*",
            title: "General",
            url: "/website/general",
            icon: "settings",
          },
          {
            pages: "*",
            title: "Domains",
            url: "/website/domains",
            icon: "globe",
          },
          {
            pages: "*",
            title: "Templates",
            url: "/website/templates",
            icon: "image",
          },
          {
            pages: "*",
            title: "Pages",
            url: "/website/pages",
            icon: "list",
          },
        ],
      },
    ],
  },
  {
    label: "Administration",
    items: [
      {
        pages: ["role_tickets", "role_tickets_add", "role_tickets_assigned", "role_tickets_all"],
        title: "Tickets",
        url: "/tickets",
        icon: "messageCircleQuestion",
        isActive: false,
        items: [
          {
            pages: ["role_tickets"],
            title: "My Tickets",
            url: "/tickets",
            icon: "role",
          },
          {
            pages: ["role_tickets_all"],
            title: "All Tickets",
            url: "/tickets/all",
            icon: "role",
          },
          {
            pages: ["role_tickets_assigned"],
            title: "Assigned Tickets",
            url: "/tickets/assigned",
            icon: "role",
          },
          {
            pages: ["role_tickets_add"],
            title: "New Ticket",
            url: "/tickets/new",
            icon: "add",
          },
        ],
      },
      {
        pages: ["role_manage_approvals"],
        title: "Approval Requests",
        url: "/approval-requests",
        icon: "checkCircle",
        isActive: false,
        items: [],
      },
      {
        pages: ["role_team", "role_invite_users", "role_manage_roles"],
        title: "Team",
        url: "/team",
        icon: "users",
        isActive: false,
        items: [
          {
            pages: ["role_team"],
            title: "Team Members",
            url: "/team",
            icon: "users",
          },
          {
            pages: ["role_invite_users"],
            title: "Invite Team Member",
            url: "/team/invite-member",
            icon: "personadd",
          },
          {
            pages: ["role_manage_roles"],
            title: "Roles & Permissions",
            url: "/team/roles",
            icon: "checkCircle",
          },
        ],
      },
      {
        pages: ["role_settings"],
        title: "Settings",
        url: "/settings",
        icon: "settings",
        isActive: false,
        items: [],
      },
    ],
  },
];

export const customerNavItems: NavItem[] = [
  {
    pages: "*",
    title: "Dashboard",
    url: "/dashboard",
    icon: "house",
    isActive: false,
    items: [],
  },
  {
    pages: ["role_reports"],
    title: "Messages",
    url: "/messages",
    icon: "mail",
    isActive: false,
    items: [],
  },
  {
    pages: ["role_reports"],
    title: "Rates",
    url: "/currency-rates",
    icon: "circleDollarSign",
    isActive: false,
    items: [],
  },
  {
    pages: ["role_reports"],
    title: "Buy",
    url: "/buy",
    icon: "box",
    isActive: false,
    items: [],
  },
  {
    pages: ["role_reports"],
    title: "Sell",
    url: "/sell",
    icon: "send",
    isActive: false,
    items: [],
  },
  {
    pages: ["role_abs", "role_manage_contacts"],
    title: "Transactions",
    url: "#",
    icon: "bank",
    isActive: false,
    items: [
      {
        pages: ["role_abs"],
        title: "Buy History",
        url: "/buy-history",
        icon: "role",
      },
      {
        pages: ["role_abs"],
        title: "Sell History",
        url: "/sell-history",
        icon: "role",
      },
    ],
  },
  {
    pages: ["role_abs", "role_manage_contacts"],
    title: "Refferals",
    url: "#",
    icon: "share",
    isActive: false,
    items: [
      {
        pages: ["role_abs"],
        title: "My Refferals",
        url: "/contacts/all",
        icon: "role",
      },
      {
        pages: ["role_manage_contacts"],
        title: "Withdrawals",
        url: "/contacts",
        icon: "role",
      },
      {
        pages: ["role_manage_contacts"],
        title: "Share refferal link",
        url: "/contacts/new",
        icon: "add",
      },
    ],
  },
  {
    pages: [""],
    title: "My Account",
    url: "#",
    icon: "settings",
    isActive: false,
    items: [
      {
        pages: [""],
        title: "My Profile",
        url: "/profile",
        icon: "location",
      },
      {
        pages: [""],
        title: "Phone Verification",
        url: "/phone-verification",
        icon: "location",
      },
      {
        pages: [""],
        title: "ID Verification",
        url: "/id-verification",
        icon: "location",
      },
      {
        pages: [""],
        title: "Password & Security",
        url: "/update-password",
        icon: "location",
      },
      {
        pages: [""],
        title: "Bank Accounts",
        url: "/bank-accounts",
        icon: "location",
      },
    ],
  },
  {
    pages: ["role_abs"],
    title: "Support",
    url: "#",
    icon: "messageCircleQuestion",
    isActive: false,
    items: [
      {
        pages: ["role_abs"],
        title: "Tickets",
        url: "/tickets",
        icon: "role",
      },
      {
        pages: ["role_abs"],
        title: "Create Ticket",
        url: "/tickets/new",
        icon: "role",
      },
    ],
  },
];

export const getFirstLetter = (fullName: any) => {
  if (!fullName) return ""
  // console.log("fullname", fullName)
  // const names = fullName?.split(" ");
  // if (names.length === 0) {
  //   return "";
  // }

  const firstNameInitial = fullName?.first_name || "";
  const lastNameInitial = fullName?.last_name || "";
  // const firstNameInitial = names[0][0]?.toUpperCase();
  // const lastNameInitial = names[names.length - 1][0]?.toUpperCase();

  return `${firstNameInitial}${lastNameInitial}`;
};

export const features = [
  // Leads Management
  { value: "role_receive_leads", label: "Receive Leads" },
  { value: "role_manage_referral_leads", label: "Referral Leads" },
  { value: "role_add_leads", label: "Create Lead" },
  { value: "role_all_leads", label: "All Leads" },
  { value: "role_manage_leads", label: "Manage Lead" },

  // Role Management
  { value: "role_add_roles", label: "Create Role" },
  { value: "role_manage_roles", label: "Manage Role" },

  // Inventory Management
  { value: "role_add_inventories", label: "Create Inventory" },
  { value: "role_all_inventories", label: "All Inventories" },
  { value: "role_manage_inventories", label: "Manage Inventory" },

  // Approvals
  { value: "role_manage_approvals", label: "Manage Approvals" },

  // User Management
  { value: "role_invite_users", label: "Invite Users" },
  { value: "role_manage_users", label: "Manage Team Members" },

  // Agent Status
  { value: "role_is_agent", label: "Agent" },

  // Confidential Access
  { value: "role_can_view_leads_confidential", label: "Manage Lead Confidentials" },
  { value: "role_can_view_list_confidential", label: "Manage Inventory Confidentials" },

  // Location Management
  { value: "role_add_locations", label: "Create Location" },
  { value: "role_manage_locations", label: "Manage Location" },

  // Other Features
  { value: "role_dncr", label: "DNCR" },
  { value: "role_manage_contacts", label: "My Clients" },
  { value: "role_manage_properties", label: "Properties & Units" },
  { value: "role_manage_rent", label: "Rent" },
  { value: "role_manage_tenants", label: "Tenants" },

  // Landing Pages
  { value: "role_add_landing", label: "Add Landing Page" },
  { value: "role_manage_landing", label: "Manage Landing Pages" },

  // Tickets
  { value: "role_all_tickets", label: "All Tickets" },
  { value: "role_assigned_tickets", label: "Assigned Tickets" },
  { value: "role_tickets", label: "My Tickets" },
  { value: "role_add_ticket", label: "Add Ticket" },

  // DXB Projects
  { value: "role_add_dxb_project", label: "Add DXB Projects" },
  { value: "role_manage_dxb_projects", label: "View DXB Projects" },
];

export const formatInventoryDate = (inputDate: string) => {
  const date = new Date(inputDate);
  const options: any = { month: "short", day: "2-digit", year: "numeric" };

  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);
  return formattedDate.replace(" ", "/").replace(",", "/");
};
export const Status = Object.freeze({
  Cold: "Cold",
  New: "New",
  Warm: "Warm",
  Hot: "Hot",
});
export const RequestStatus = Object.freeze({
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  DECLINED: "DECLINED",
});

export const formatDate = (dateString: string, isShort?: boolean) => {
  const date = new Date(dateString);
  const formattedDate = date.toLocaleString("en-US", {
    month: isShort ? "short" : "long",
    year: "numeric",
    day: "numeric",
  });
  const datePart = formattedDate;
  return datePart;
};