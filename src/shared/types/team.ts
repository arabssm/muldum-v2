import React from "react";

export const Groups = ["공유캘린더", "월말평가", "화상통화", "노션"] as const;
export type GroupType = typeof Groups[number];

export const LockedGroups: readonly GroupType[] = ["노션", "화상통화", "공유캘린더"];

export interface GroupProps {
  active: GroupType | null;
  setActive: React.Dispatch<React.SetStateAction<GroupType | null>>;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  isOwnTeam?: boolean;
}

export interface Errors {
  item: boolean;
  price: boolean;
  link: boolean;
  reason: boolean;
}

export interface FormInputProps {
  label: string;
  value: string;
  setValue: (v: string) => void;
  placeholder?: string;
  width?: string;
  height?: string;
  error?: string;
}
export interface ItemFormProps {
  handleSubmit?: (data: { item: string; price: string; link: string; reason: string; quantity: number }) => void;
}

export interface FormSectionProps {
  title: string;
  placeholders: string[];
  isTextarea?: boolean;
  must?: boolean; 
}

export type Team = {
    teamName: string;
    members: string;
};

export interface NotionProps {
    teamId: string;
    readOnly?: boolean;
}