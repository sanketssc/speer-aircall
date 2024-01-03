import React from "react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import {
  PhoneMissedIcon,
  PhoneIncomingIcon,
  PhoneOutgoingIcon,
  VoicemailIcon,
} from "lucide-react";
import { Button } from "./ui/button";

import { type CallDetails } from "@/types";

export default function CallLog({
  arr,
  archiveOne,
  isActivity,
}: {
  arr: CallDetails[];
  archiveOne: Function;
  isActivity: boolean;
}) {
  return (
    <>
      {arr.map((call) => {
        if (call.is_archived === isActivity) return null;
        return (
          <AccordionItem key={call.id} value={call.id}>
            <AccordionTrigger className="AccordionTrigger">
              <div className="flex items-center w-full sm:w-4/5 justify-around sm:gap-20">
                {call.direction === "inbound" ? (
                  call.call_type === "voicemail" ? (
                    <VoicemailIcon className="phoneicons mr-2 text-blue-400" />
                  ) : call.call_type === "missed" ? (
                    <PhoneMissedIcon className="phoneicons mr-2 text-red-500" />
                  ) : (
                    <PhoneIncomingIcon className="phoneicons mr-2 text-green-500" />
                  )
                ) : (
                  <PhoneOutgoingIcon className="phoneicons mr-2 text-green-700" />
                )}
                <div className="flex w-3/5 justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-base font-semibold">
                      From: {call.from}
                    </span>
                    <span className="text-base font-semibold">
                      To: {call.to}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-neutral-500">
                      {new Date(call.created_at).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        hour12: false,
                        minute: "numeric",
                      })}
                      {", "}
                      {new Date(call.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex justify-between items-center p-4">
                <div className="flex flex-col ">
                  <span>From: {call.from}</span>
                  <span>To: {call.to}</span>
                  <span>Via: {call.via}</span>
                </div>
                <div className="flex flex-col">
                  <span>Duration: {call.duration}</span>
                  <span>Call type: {call.call_type}</span>
                  <span>
                    Created at: {new Date(call.created_at).toLocaleString()}
                  </span>
                </div>
                <div>
                  <Button
                    variant="outline"
                    size="default"
                    className=""
                    onClick={() => {
                      archiveOne(call.id, isActivity);
                    }}
                  >
                    {isActivity ? "Archive" : "Unarchive"}
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </>
  );
}
