import { TextRecordCard } from "./Types";
import twitter from "../../assets/icons/texts/twitter.svg";
import telegram from "../../assets/icons/texts/telegram.svg";
import bio from "../../assets/icons/texts/bio.svg";
import nickname from "../../assets/icons/texts/nickname.svg";
import github from "../../assets/icons/texts/github.svg";
import email from "../../assets/icons/texts/email.svg";
import website from "../../assets/icons/texts/website.svg";
import discord from "../../assets/icons/texts/discord.svg";
import warpcast from "../../assets/icons/texts/warpcast.svg";
import location from "../../assets/icons/texts/location.svg";

const generalTexts: TextRecordCard[] = [
    {
      key: "name",
      label: "Nickname",
      icon: nickname,
      placeholder: "Your nickname"
    },
    {
      key: "description",
      label: "Short bio",
      icon: bio,
      placeholder: "Let me tell you something about me..."
    },
    {
      key: "location",
      label: "Location",
      icon: location,
      placeholder: "Tokyo, Japan"
    },
    {
      key: "url",
      label: "Website",
      icon: website,
      placeholder: "https://www.example.com"
    },
    {
      key: "email",
      label: "Email",
      icon: email,
      placeholder: "name@email.com"
    },
  ];
  
 const socialTexts: TextRecordCard[] = [
    {
      key: "com.twitter",
      label: "Twitter",
      icon: twitter,
      placeholder: "eg. namespace"
    },
    {
      key: "com.warpcast",
      label: "Warpcast",
      icon: warpcast,
      placeholder: "eg. namespace.eth"
    },
    {
      key: "com.github",
      label: "Github",
      icon: github,
      placeholder: "eg. namespace"
    },
    {
      key: "org.telegram",
      label: "Telegram",
      icon: telegram,
      placeholder: "eg. namespace"
    },
    {
      key: "com.discord",
      label: "Discord",
      icon: discord,
      placeholder: "eg. namespace"
    }
  ];
  export const textsCategories: Record<string, TextRecordCard[]> = {
    General: generalTexts,
    Social: socialTexts,
  };

  export const availableTexts = [...textsCategories.General, ...textsCategories.Social];