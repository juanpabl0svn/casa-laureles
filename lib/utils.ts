import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const URL = process.env.NEXT_PUBLIC_URL || process.env.URL || 'http://supermaderas.com'

export const PHONE = process.env.NEXT_PUBLIC_PHONE || process.env.PHONE || '+57 300 610 4153'

export const CLEAN_PHONE = PHONE.replace(/\D/g, '')

export const WHATSAPP_URL = `https://api.whatsapp.com/send?phone=${CLEAN_PHONE}`

export const MAIL_USERNAME = process.env.NEXT_PUBLIC_MAIL_USERNAME || process.env.MAIL_USERNAME || 'asesoria@yconsultores.com'

export const MAIL_PASSWORD = process.env.NEXT_PUBLIC_MAIL_PASSWORD || process.env.MAIL_PASSWORD || 'Catalin42024.'