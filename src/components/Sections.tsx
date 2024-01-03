"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModeToggle } from "./ModeToggle";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { Accordion } from "@/components/ui/accordion";

import { RotateCcwIcon } from "lucide-react";
import CallLog from "./CallLog";
import { type CallDetails } from "@/types";

export default function Sections() {
  const [archiveDone, setArchiveDone] = useState<boolean>(false);
  const [activity, setActivity] = useState<CallDetails[]>([]);
  const [archived, setArchived] = useState<CallDetails[]>([]);
  const [archiving, setArchiving] = useState<boolean>(false);

  const fetchActivities = () => {
    fetch("https://cerulean-marlin-wig.cyclic.app/activities")
      .then((res) => res.json())
      .then((data) => {
        const filteredData = data.filter((call: CallDetails) => {
          if (!call.direction) return false;
          if (!call.from) return false;
          if (!call.to) return false;
          return true;
        });
        let archived: CallDetails[] = [];
        let activity: CallDetails[] = [];
        filteredData.forEach((call: CallDetails) => {
          if (call.is_archived) {
            archived.push(call);
          } else {
            activity.push(call);
          }
        });
        setActivity(activity);
        setArchived(archived);
      });
  };
  useEffect(() => {
    fetchActivities();
  }, []);

  useEffect(() => {
    if (archiveDone) {
      fetchActivities();
      setArchiveDone(false);
      setArchiving(false);
    }
  }, [archiveDone]);

  const archiveAll = (arr: CallDetails[], value: boolean) => {
    setArchiving(true);
    let time = 0;
    arr.forEach((call) => {
      setTimeout(() => {
        fetch(`https://cerulean-marlin-wig.cyclic.app/activities/${call.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ is_archived: value }),
        });
      }, time);
      time = time + 200;
    });
    setTimeout(() => {
      setArchiveDone(true);
    }, time + 1000);
  };

  const archiveOne = (id: string, value: boolean) => {
    fetch(`https://cerulean-marlin-wig.cyclic.app/activities/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ is_archived: value }),
    }).then(() => {
      setArchiveDone(true);
    });
  };

  return (
    <Tabs
      defaultValue="activity"
      className="md:w-11/12 lg:w-4/5 mx-auto max-w-screen-lg"
    >
      <TabsList className="flex w-full items-center ">
        <TabsTrigger className="grow" value="activity">
          Activity Feed ({activity.length})
        </TabsTrigger>
        <TabsTrigger className="grow" value="archived">
          Archived Calls ({archived.length})
        </TabsTrigger>
        <Button
          className="ml-auto"
          variant="ghost"
          size="icon"
          onClick={() => {
            fetch("https://cerulean-marlin-wig.cyclic.app/reset", {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ reset: true }),
            }).then(() => {
              setArchiveDone(true);
            });
          }}
        >
          <RotateCcwIcon className="w-5 h-5" />
        </Button>
        <ModeToggle />
      </TabsList>
      <TabsContent value="activity">
        <Button
          variant="outline"
          size="default"
          className="w-full"
          disabled={archiving}
          onClick={() => {
            archiveAll(activity, true);
          }}
        >
          {archiving ? "Archiving..." : "Archive All"} ({activity.length})
        </Button>
        <Accordion type="single" collapsible className="w-full">
          {activity.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <span className="text-2xl font-semibold text-neutral-500">
                No calls to show
              </span>
            </div>
          ) : (
            <CallLog archiveOne={archiveOne} arr={activity} isActivity={true} />
          )}
        </Accordion>
      </TabsContent>
      <TabsContent value="archived">
        <Button
          variant="outline"
          size="default"
          className="w-full"
          disabled={archiving}
          onClick={() => {
            archiveAll(archived, false);
          }}
        >
          {archiving ? "Unarchiving..." : "Unarchive All"} ({archived.length})
        </Button>
        <Accordion type="single" collapsible className="w-full">
          {archived.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <span className="text-2xl font-semibold text-neutral-500">
                No calls to show
              </span>
            </div>
          ) : (
            <CallLog
              archiveOne={archiveOne}
              arr={archived}
              isActivity={false}
            />
          )}
        </Accordion>
      </TabsContent>
    </Tabs>
  );
}
