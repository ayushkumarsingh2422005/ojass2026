import { IconType } from "react-icons";
import {
    FaGithub,
    FaHome,
    FaInstagram,
    FaLinkedin,
    FaTrophy,
    FaTwitter,
} from "react-icons/fa";
import { MdMail, MdMessage } from "react-icons/md";
import { RiTeamFill } from "react-icons/ri";

export type Theme = "utopia" | "dystopia";

export type Icons = { title: string; element: IconType }[];

export const NavItems: Icons = [
    { title: "Home", element: FaHome },
    { title: "Events", element: FaTrophy },
    { title: "Team", element: RiTeamFill },
    { title: "Sponsors", element: MdMessage },
    { title: "Contact", element: MdMail },
];

export const SocialMediaItems: Icons = [
    { title: "Instagram", element: FaInstagram },
    { title: "Twitter", element: FaTwitter },
    { title: "LinkedIn", element: FaLinkedin },
    { title: "GitHub", element: FaGithub },
];
