"use client";

import React from "react";
import {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineHeader,
  TimelineTitle,
  TimelineIcon,
  TimelineDescription,
  TimelineContent,
  TimelineTime,
} from "@/components/timeline/timeline";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface TimelineLayoutProps {
  items: any[];
}
export const TimelineLayout = ({ items }: TimelineLayoutProps) => {
  return (
    <Timeline>
      {items?.map((item) => (
        <TimelineItem key={item.date}>
          <TimelineConnector />
          <TimelineHeader>
            <TimelineIcon />
            <Avatar>
              <AvatarImage src="" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <TimelineTitle className="text-foreground text-[12px] font-normal">
                {item?.createdAt}
              </TimelineTitle>
              <TimelineTitle>
                {item?.name}{" "}
                <span className="text-brand text-sm">{item?.type}</span>
              </TimelineTitle>
            </div>
          </TimelineHeader>
          <TimelineContent>
            <TimelineDescription>{item?.log}</TimelineDescription>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
};
