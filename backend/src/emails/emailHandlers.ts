import { resendClient, sender } from '../lib/resend.js';
import { createWelcomeEmailTemplate } from './emailTemplate.js';

export const sendWelcomeEmail = async (email: string, name: string, clientURL: string) => {
  const { data, error } = await resendClient.emails.send({
    from: `${sender.name} <${sender.email}>`,
    to: email,
    subject: 'Welcome to Echo!',
    html: createWelcomeEmailTemplate(name, clientURL),
  });

  if (error) {
    console.error('Error sending a email: ', error);
    throw new Error('Failed to send a email!');
  }

  console.log('Email sent successfully!', data);
};
