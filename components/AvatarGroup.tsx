import React from "react";
import Image from "next/image";
import Link from "next/link";

// Define the UserProps interface
interface UserProps {
  id: string;
  name: string;
  profile_picture?: string;
  email: string;
  bio?: string;
  location?: string;
  following_count?: number;
  followers_count?: number;
  posts_count?: number;
}

// Sample users data
const sampleUsers: UserProps[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    // profile_picture: "/api/placeholder/150/150",
    email: "sarah.j@example.com",
    bio: "Digital artist & UX designer",
    location: "San Francisco, CA",
    following_count: 245,
    followers_count: 1250,
    posts_count: 89,
  },
  {
    id: "2",
    name: "David Chen",
    // profile_picture: "/api/placeholder/150/150",
    email: "david.c@example.com",
    bio: "Software Engineer | Coffee enthusiast",
    location: "Seattle, WA",
    following_count: 180,
    followers_count: 890,
    posts_count: 45,
  },
  {
    id: "3",
    name: "Maria Garcia",
    // profile_picture: "/api/placeholder/150/150",
    email: "maria.g@example.com",
    bio: "Product Manager",
    location: "Austin, TX",
    following_count: 310,
    followers_count: 760,
    posts_count: 67,
  },
];

const generateColor = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `hsl(${hash % 360}, 95%, 35%)`;
  return color;
};

const AvatarGroup = ({ users = sampleUsers }: { users?: UserProps[] }) => {
  const extraUsers =
    users?.length >= 1000
      ? `${(users?.length / 1000).toFixed(1)}k`
      : `${users?.length}`;

  return (
    <div className="flex items-center">
      {users?.slice(0, 5).map((user, index) => (
        <div
          key={index}
          className="mr-[-14px] border-2 border-none cursor-pointer"
        >
          {user.profile_picture ? (
            <Link
              href={`/social-app/profile/${user?.id}`}
              className="relative overflow-hidden text-white w-10 h-10 rounded-full flex justify-center items-center"
            >
              <Image
                src={user.profile_picture}
                alt={`${user.name}`}
                layout="fill"
                objectFit="cover"
                className="rounded-full object-cover"
              />
            </Link>
          ) : (
            <Link
              href={`/social-app/profile/${user?.id}`}
              className="text-white w-10 h-10 rounded-full flex justify-center items-center font-bold"
              style={{ backgroundColor: generateColor(user.name[0]) }}
            >
              {user.name[0]}
            </Link>
          )}
        </div>
      ))}
      {parseInt(extraUsers) > 5 && (
        <div className="text-white w-10 h-10 rounded-full flex justify-center items-center font-bold bg-[#A52A2A]">
          +{parseInt(extraUsers) - 5}
        </div>
      )}
    </div>
  );
};

export default AvatarGroup;
