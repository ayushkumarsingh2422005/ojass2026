import { IconType } from "react-icons";
import { FaGithub, FaHome, FaLinkedin, FaTwitter } from "react-icons/fa";
import { BiSolidCalendarEvent } from "react-icons/bi";
import { FaSquareInstagram } from "react-icons/fa6";
import { RiGalleryFill } from "react-icons/ri";
import { FaHandshakeAngle } from "react-icons/fa6";
import { MdMail } from "react-icons/md";

export type Theme = "utopia" | "dystopia";

export type Icons = { title: string; element: IconType }[];

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

export interface GalleryImage {
    src: string;
    caption: string;
}

export const galleryImages: GalleryImage[] = [
    {
        src: "image-1.jpg",
        caption:
            "30 knots <br>12 x 16 inch C type hand print <br>Edition of 1 Plus an additional artist Proof <br>2021",
    },
    {
        src: "image-2.jpg",
        caption:
            "Sad Mis-Step <br>12 x 16 inch C type hand print <br>Edition of 1 Plus an additional artist Proof <br>2024",
    },
    {
        src: "image-3.jpg",
        caption:
            "Mini Orange <br>12 x 16 inch C type hand print <br>Edition of 1 Plus an additional artist Proof <br>2014",
    },
    {
        src: "image-4.jpg",
        caption:
            "After Storm <br>12 x 16 inch C type hand print <br>Edition of 1 Plus an additional artist Proof <br>2022",
    },
    {
        src: "image-5.jpg",
        caption:
            "Untitled <br>12 x 16 inch C type hand print <br>Edition of 1 Plus an additional artist Proof <br>2016",
    },
    {
        src: "image-6.jpg",
        caption:
            "Toilet Paper <br>12 x 16 inch C type hand print <br>Edition of 1 Plus an additional artist Proof <br>2022",
    },
    {
        src: "image-7.jpg",
        caption:
            "Cocoa Eggplant Tomato <br>12 x 16 inch C type hand print <br>Edition of 1 Plus an additional artist Proof <br>2025",
    },
    {
        src: "image-8.jpg",
        caption:
            "Toilet Paper <br>12 x 16 inch C type hand print <br>Edition of 1 Plus an additional artist Proof <br>2022",
    },
    {
        src: "image-9.jpg",
        caption:
            "Production Fun Fact (Eggs) <br>12 x 16 inch C type hand print <br>Edition of 1 Plus an additional artist Proof <br>2024",
    },
];

export interface GalleryCell {
    x: number;
    y: number;
    w: number;
    h: number;
}

export const galleryLayout: GalleryCell[] = [
    { x: 71, y: 58, w: 400, h: 270 },
    { x: 211, y: 255, w: 540, h: 360 },
    { x: 631, y: 158, w: 400, h: 270 },
    { x: 1191, y: 245, w: 260, h: 195 },
    { x: 351, y: 687, w: 260, h: 290 },
    { x: 751, y: 824, w: 205, h: 154 },
    { x: 911, y: 540, w: 260, h: 350 },
    { x: 1051, y: 803, w: 400, h: 300 },
    { x: 71, y: 922, w: 350, h: 260 },
];
