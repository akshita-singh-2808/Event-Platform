"use client";

import { IEvent } from "@/lib/database/models/event.model";
import { formatDateTime } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { DeleteConfirmation } from "./DeleteConfirmation";

type CardProps = {
  event: IEvent;
  hasOrderLink?: boolean;
  hidePrice?: boolean;
};

const Card = ({ event, hasOrderLink, hidePrice }: CardProps) => {
  const { userId } = useAuth();
  const isEventCreator = userId === event.organizer._id.toString();

  return (
    <div className="group relative flex min-h-[380px] w-full max-w-[400px] flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg md:min-h-[438px] border ">
      {/* Top Image (Clickable) */}
      <Link
        href={`/events/${event._id}`}
        style={{ backgroundImage: `url(${event.imageUrl})` }}
        className="flex-center flex-grow bg-gray-50 bg-cover bg-center text-grey-500 "
      />

      {/* Admin Controls */}
      {isEventCreator && !hidePrice && (
        <div className="absolute right-2 top-2 z-20 flex flex-col gap-4 rounded-xl bg-white p-3 shadow-sm  transition-all">
          <Link href={`/events/${event._id}/update`}>
            <Image
              src="/assets/icons/edit.svg"
              alt="edit"
              width={20}
              height={20}
            />
          </Link>
          <DeleteConfirmation eventId={event._id} />
        </div>
      )}

      {/* Info Section with Background Image */}
      <div className="relative min-h-[230px] overflow-hidden text-white">
        {/* Background Image */}
        <div
          className="absolute top-0 left-0 h-full w-full bg-cover bg-center z-0"
          style={{ backgroundImage: "url('/assets/images/picture.svg')" }}
        />
        {/* Optional Dark Overlay */}
        <div className="absolute top-0 left-0 h-full w-full bg-black/40 z-[1]" />

        {/* Foreground Content */}
        <div className="relative z-10 flex flex-col gap-3 p-5 md:gap-4">
          {!hidePrice && (
            <div className="flex gap-2">
              <span className="p-semibold-14 w-min rounded-full bg-green-100 px-4 py-1 text-green-800">
                {event.isFree ? "FREE" : `$${event.price}`}
              </span>
              <p className="p-semibold-14 w-min rounded-full bg-black/30 px-4 py-1 text-white line-clamp-1">
                {event.category.name}
              </p>
            </div>
          )}

          <p className="p-medium-16 text-white/80">
            {formatDateTime(event.startDateTime).dateTime}
          </p>

          <Link href={`/events/${event._id}`}>
            <p className="p-medium-16 md:p-medium-20 line-clamp-2 flex-1 text-white">
              {event.title}
            </p>
          </Link>

          <div className="flex-between w-full">
            <p className="p-medium-14 md:p-medium-16 text-white/70">
              {event.organizer.firstName} {event.organizer.lastName}
            </p>

            {hasOrderLink && (
              <Link
                href={`/orders?eventId=${event._id}`}
                className="flex gap-2"
              >
                <p className="text-primary-300">Order Details</p>
                <Image
                  src="/assets/icons/arrow.svg"
                  alt="arrow"
                  width={10}
                  height={10}
                />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
