/**
 * Genera un link de WhatsApp con un mensaje predefinido
 * @param name - Nombre del usuario (opcional)
 * @returns URL de WhatsApp con el mensaje
 */
export function getWhatsAppLink(name?: string): string {
  // Número de WhatsApp: +54 9 3573 43-6982
  const whatsappNumber = '5493573436982';
  
  const message = name 
    ? `Hola Agustin, soy ${name} quiero el coaching.`
    : 'Hola Agustin, quiero el coaching.';
  
  // Codificar el mensaje para URL
  const encodedMessage = encodeURIComponent(message);
  
  return `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
}

