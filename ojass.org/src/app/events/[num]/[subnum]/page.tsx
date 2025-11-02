"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import Data from "../../event.json";

// ---------- 1️⃣ Types ----------
interface PrizeData {
  total: string;
  winner: string;
  first_runner_up?: string;
  second_runner_up?: string;
}

interface EventHead {
  name: string;
  Phone: string;
}

interface EventData {
  id: string;
  name: string;
  img: string;
  description: string;
  rulebookurl: string;
  prizes: PrizeData;
  details: string[];
  rules: string[];
  teamSizeMin: string;
  event_head: EventHead;
}

interface UserData {
  paid: boolean;
  events: string[];
}

// ---------- 2️⃣ Component ----------
const Page: React.FC = () => {
  const router = useRouter();
  const eve = useParams() as { num: string; subnum: string };
  const i = parseInt(eve.num);
  const j = parseInt(eve.subnum);
  const dataeve: EventData = (Data as any)[i][j];

  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const handleRegister = () => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (!user.paid) {
      toast.error("Please complete your registration payment first");
      return;
    }

    router.push("/dashboard/events");
    toast.success("Please complete your registration in the Events section");
  };

  if (loading) return null;

  const isRegistered = user?.events?.includes(dataeve.id);
  const isTeamEvent = parseInt(dataeve.teamSizeMin) > 1;

  const getRegistrationButton = () => {
    if (!user) {
      return (
        <button
          onClick={() => router.push("/login")}
          className="px-5 py-1 text-base rounded-full border-2 bg-white/10 hover:text-black cursor-pointer"
        >
          Login to Register
        </button>
      );
    }

    if (isRegistered) {
      return (
        <div className="px-5 py-1 text-base rounded-full border-2 bg-green-500/20 text-green-300">
          Already Registered
        </div>
      );
    }

    return (
      <button
        onClick={handleRegister}
        disabled={!user.paid}
        className={`px-5 py-1 text-base rounded-full border-2 ${
          user.paid
            ? "bg-white/10 hover:text-black cursor-pointer"
            : "bg-gray-500/20 text-gray-400 cursor-not-allowed"
        }`}
      >
        {user.paid
          ? `Register ${isTeamEvent ? "Team" : "Now"}`
          : "Complete Registration First"}
      </button>
    );
  };

  return (
    <section className="flex items-center w-full font-poppins bg-[url('/subeve2.jpeg')] bg-center bg-cover bg-no-repeat bg-fixed">
      <div
        className="justify-center flex-1 w-full mx-auto md:px-6 pt-28 pb-20"
        style={{
          background:
            "linear-gradient(to bottom, rgba(2, 2, 2, 0.533), rgba(2, 2, 2, 0.533))",
        }}
      >
        <div className="px-4 mb-10 md:text-center md:mb-20">
          <div className="flex justify-center">
            <h2 className="lg:text-5xl text-3xl font-semibold font-serif">
              {dataeve.name}
            </h2>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center lg:px-32 w-full">
          <div className="w-full px-4 mb-10 lg:w-1/2 flex justify-center lg:mb-0">
            <img
              src={dataeve.img}
              alt={dataeve.name}
              className="w-[350px] md:w-[430px] h-[315px] md:h-[400px] rounded-3xl object-cover"
            />
          </div>

          <div className="w-full px-4 lg:pl-10 mb-10 lg:w-1/2 lg:mb-0">
            <h2 className="py-3 pl-2 mb-4 text-3xl font-bold text-gray-200 border-l-4 border-white">
              Description
            </h2>
            <p className="mb-4 text-base leading-7 md:w-3/4 text-gray-300">
              {dataeve.description}
            </p>

            <div className="flex flex-wrap lg:text-xl text-xl md:text-base items-baseline gap-7">
              {getRegistrationButton()}
              <a
                href={dataeve.rulebookurl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="px-5 py-1 text-base rounded-full border-2 bg-white/10 hover:text-black">
                  Rule Book
                </button>
              </a>
            </div>
          </div>
        </div>

        {/* Prize Section */}
        <div className="flex flex-col justify-center items-center lg:mt-16 gap-5 px-3">
          <h2 className="text-4xl font-semibold">Prize Worth</h2>
          <div className="flex flex-col justify-center items-center gap-2 font-medium text-lg bg-white/15 p-6 rounded-lg md:w-96 w-80">
            <p>Total : {dataeve.prizes.total}</p>
            <p>Winner : {dataeve.prizes.winner}</p>
            {dataeve.prizes.first_runner_up && (
              <p>First Runner Up : {dataeve.prizes.first_runner_up}</p>
            )}
            {dataeve.prizes.second_runner_up && (
              <p>Second Runner Up : {dataeve.prizes.second_runner_up}</p>
            )}
            <p>Certificates to all Participants</p>
          </div>
        </div>

        {/* Details Section */}
        <div className="flex flex-col mt-16 gap-5">
          <h2 className="text-4xl text-center font-semibold">Details</h2>
          {dataeve.details?.map((detail, idx) => (
            <div key={idx} className="lg:px-20">
              <p className="font-medium text-lg px-3 lg:px-40">- {detail}</p>
            </div>
          ))}
        </div>

        {/* Rules Section */}
        <div className="flex flex-col justify-center items-center">
          <div className="md:w-3/4 mx-3 flex flex-col justify-center items-center mt-16 gap-5 bg-white/15 p-6 rounded-lg">
            <h2 className="text-4xl font-semibold">Rules</h2>
            <div className="flex flex-col justify-center gap-2 font-medium text-lg">
              {dataeve.rules?.map((rule, idx) => (
                <p key={idx}>
                  {idx + 1}. {rule}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="flex flex-col justify-center items-center gap-5 mt-8 md:text-3xl text-xl px-2">
          <p className="text-center">
            Event Head : {dataeve.event_head.name}
          </p>
          <p className="text-center">
            Contact No : {dataeve.event_head.Phone}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Page;
