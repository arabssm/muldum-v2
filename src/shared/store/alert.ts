import {create} from 'zustand'

interface AlertState {
	isStatus: "none" | "success" | "error" | "no_outh";
	isVisible: boolean;
	isLeavingAnimation: boolean;
	description: string;
	none: () => void;
	setIsLeavingAnimation: (isLeaving: boolean) => void;
	success: (des: string) => void;
	error: (des: string) => void;
}