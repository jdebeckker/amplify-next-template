'use server'; // Verplicht bovenaan!

import { PinpointClient, PinpointClientConfig } from "@aws-sdk/client-pinpoint";
import { SendMessagesCommand, SendMessagesCommandInput } from "@aws-sdk/client-pinpoint";

// Initialiseer de client HIER op de server
const pinpoint = new PinpointClient({ region: "eu-west-1" });

export async function sendAPNSNotification(deviceToken: string) {
  console.log("Server ontvangt token:", deviceToken);
  
  
  const params: SendMessagesCommandInput = {
    ApplicationId: "56efa3c23b5d442381f86cbb2baebbf7", // Verplicht: Dit staat in de AWS Console
    MessageRequest: {
      Addresses: {
        [deviceToken]: {          // Je testToken variabele
          ChannelType: "APNS_SANDBOX"     // Voor Apple Push Notification service
        }
      },
      MessageConfiguration: {
        APNSMessage: {            // MOET matchen met ChannelType "APNS"
          Action: "OPEN_APP",
          Body: "Het is nu " + new Date().toLocaleTimeString(),
          Title: "Melding vanuit AWS",
          Sound: "default"
        }
      }
    }
  };

  try {
      const command = new SendMessagesCommand(params);
      const response = await pinpoint.send(command);
      return { success: true, messageId: response.MessageResponse?.Result?.[deviceToken]?.MessageId };
    } catch (error) {
      console.error("Fout bij verzenden:", error);
      
      // Controleer of 'error' een echt Error object is
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      return { success: false, error: errorMessage };
    }

  return { success: true };
}
