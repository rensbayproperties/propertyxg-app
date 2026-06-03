import siteData from "@/constant/site";

type LogoVariant = {
  variant?: "white" | "default";
};

export default function Logo({ variant = "default" }: LogoVariant) {
  if (variant === "white") {
    return (
      <div className="flex items-center text-xl gap-1.5">
        <i className="bi-box-fill text-white"></i>
        <div className="text-white flex">{siteData.name}</div>
      </div>
    );
  }
  return (
    <div className="flex items-center text-xl gap-1.5">
      <i className="bi-box-fill"></i>
      <div className="flex font-extrabold">{siteData.name}</div>
    </div>
  );
}
