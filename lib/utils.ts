import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const URL = 'https://supermaderas.com'

export const PHONE = '+57 300 610 4153'

export const CLEAN_PHONE = PHONE.replace(/\D/g, '')

export const WHATSAPP_URL = `https://api.whatsapp.com/send?phone=${CLEAN_PHONE}`

export const EMAIL = 'asesoria@yconsultores.com'