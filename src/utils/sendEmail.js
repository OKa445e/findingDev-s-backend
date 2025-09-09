const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient");

// Function to create the SendEmailCommand
const createSendEmailCommand = (toAddress, fromAddress, subject, body) => {
  return new SendEmailCommand({
    Destination: {
      ToAddresses: [toAddress],
      CcAddresses: [], 
    },
    Message: {
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `<h1>${body}</h1>`,
        },
        Text: {
          Charset: "UTF-8",
          Data: body, // plain text version of email
        },
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [], // add Reply-To addresses if needed
  });
};

// Function to send email
const run = async (subject, body, toEmailId) => {
  const sendEmailCommand = createSendEmailCommand(toEmailId, "atharvdav@gmail.com", subject, body);

  try {
    const response = await sesClient.send(sendEmailCommand);
    return response;
  } catch (error) {
    if (error.name === "MessageRejected") {
      return error; // specific handling for MessageRejected
    }
    throw error; // rethrow other errors
  }
};

module.exports = { run };
