import { IconType } from "react-icons";
import {
    FaGithub,
    FaHome,
    FaLinkedin,
    FaTwitter,
} from "react-icons/fa";
import { BiSolidCalendarEvent } from "react-icons/bi"
import { FaSquareInstagram } from "react-icons/fa6";
import { RiGalleryFill } from "react-icons/ri";
import { FaHandshakeAngle } from "react-icons/fa6";
import { MdMail } from "react-icons/md";

export type Theme = "utopia" | "dystopia";

export type Icons = { title: string; element: IconType; }[];

export const NavItems: Icons = [
    { title: "Home", element: FaHome },
    { title: "Events", element: BiSolidCalendarEvent },
    { title: "Gallery", element: RiGalleryFill },
    { title: "Sponsors", element: FaHandshakeAngle },
    { title: "Contact", element: MdMail },
];

export const SocialMediaItems: Icons = [
    { title: "Instagram", element: FaSquareInstagram },
    { title: "Twitter", element: FaTwitter },
    { title: "LinkedIn", element: FaLinkedin },
    { title: "GitHub", element: FaGithub },
];
