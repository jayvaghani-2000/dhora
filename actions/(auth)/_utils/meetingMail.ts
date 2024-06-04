import { config } from "@/config";
import { mailClient } from "@/lib/sendgrid";
import dayjs from "@/lib/dayjs";

export async function meetingMail(
    roomId: string,
    meetingtime: { startTime: Date | string, endTime: Date | string },
    timezone: string,
    email: { organizationMail: string, customerMail: string },
    sendMailTo: string,
    packagename: Record<string, string | null>[],
    eventname: string
) {

    const formattedStartTime = dayjs.utc(meetingtime.startTime).tz(timezone).format("LLL zzz");
    const formattedEndTime = dayjs.utc(meetingtime.endTime).tz(timezone).format("LLL zzz");

    const html = `
    <!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Template</title>
    </head>

    <style>
        * {
            font-family: sans-serif;
        }
    </style>

    <body>
        <table style="border: 0; width: 100%;">
            <tbody>
                <tr>
                    <td
                    style="border: solid 1px #dadce0; border-radius: 8px; direction: rtl; font-size: 0; padding: 24px 32px; text-align: left; vertical-align: top;">
                        <div
                        style="font-size: 13px; text-align: left; direction: ltr; display: inline-block; vertical-align: top; width: 100%; overflow: hidden; word-wrap: break-word;">
                            <table border="0" cellspacing="0" cellpadding="0" width="100%">
                            <tbody>
                                <tr>
                                    <td style="vertical-align: top; padding: 0;">
                                        <table border="0" cellspacing="0" cellpadding="0" width="100%">
                                            <tbody>
                                                <tr>
                                                    <td
                                                        style="font-size: 0; padding: 0; text-align: left; word-break: break-word; padding-bottom: 28px;">
                                                        <a href="${config.env.HOST_URL}/room?roomId=${roomId}" style="display: inline-block; font-size: 14px; letter-spacing: 0.25px; line-height: 20px; text-decoration: none; text-transform: none; word-wrap: break-word; white-space: nowrap; color: #fff; font-weight: 700;">
                                                            <table border="0" cellspacing="0" cellpadding="0"
                                                                width="100%" style="display: inline-block;">
                                                                <tbody>
                                                                    <tr>
                                                                        <td align="center" valign="middle"
                                                                            style="background-color: #2253B2; padding: 10px 25px; border: none; border-radius: 4px; margin: 0;">
                                                                            <span
                                                                                style="font-size: 14px; letter-spacing: 0.25px; line-height: 20px; text-decoration: none; text-transform: none; word-wrap: break-word; white-space: nowrap; color: #fff; font-weight: 700;">Join
                                                                                With Dhora</span>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </a>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td
                                                        style="font-size: 0; padding: 0; text-align: left; word-break: break-word; padding-bottom: 24px;">
                                                        <div
                                                            style="font-size: 14px; line-height: 20px; text-align: left;">
                                                            <table border="0" cellspacing="0" cellpadding="0"
                                                                width="100%" style="padding-bottom: 4px;">
                                                                <tbody>
                                                                    <tr>
                                                                        <td>
                                                                            <h2
                                                                                style="font-size: 14px; color: #3c4043; text-decoration: none; font-weight: 700; margin: 0; padding: 0;">
                                                                                Meeting Link:</h2>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            <div>
                                                                <a
                                                                    style="display: inline-block; color: #70757a; text-decoration: none;">${config.env.HOST_URL}/room?roomId=${roomId}</a>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div
                        style="font-size: 13px; text-align: left; direction: ltr; display: inline-block; vertical-align: top; width: 100%; overflow: hidden; word-wrap: break-word;">
                        <table border="0" cellspacing="0" cellpadding="0" width="100%"
                            style="padding-right: 32px; padding-left: 0; table-layout: fixed;">
                            <tbody>
                                <tr style="padding: 0; vertical-align: top;">
                                    <td>
                                        <table border="0" cellspacing="0" cellpadding="0" width="100%"
                                            style="table-layout: fixed;">
                                            <tbody>
                                                <tr>
                                                    <td
                                                        style="font-size: 0; padding: 0; text-align: left; word-break: break-word; padding-bottom: 24px;">
                                                        <div
                                                            style="font-style: normal; font-weight: 400; font-size: 14px; line-height: 20px; letter-spacing: 0.2px; color: #3c4043; text-decoration: none;">
                                                            <span aria-hidden="true"></span>
                                                            <table border="0" cellspacing="0" cellpadding="0"
                                                                width="100%" style="padding-bottom: 4px;">
                                                                <tbody>
                                                                    <tr>
                                                                        <td>
                                                                            <h2
                                                                                style="font-size: 14px; color: #3c4043; text-decoration: none; font-weight: 700; margin: 0; padding: 0;">
                                                                                Duration : </h2>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            <span><h2
                                                            style="font-size: 14px; color: #3c4043; text-decoration: none; font-weight: 700; margin: 0; padding: 0;">
                                                            Start time : </h2>${formattedStartTime}</span><br/>
                                                            <span><h2 style="font-size: 14px; color: #3c4043; text-decoration: none; font-weight: 700; margin: 0; padding: 0;">
                                                            End time : </h2>${formattedEndTime}</span>
                                                        </div>
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td
                                                        style="font-size: 0; padding: 0; text-align: left; word-break: break-word; padding-bottom: 24px;">
                                                        <div
                                                            style="font-style: normal; font-weight: 400; font-size: 14px; line-height: 20px; letter-spacing: 0.2px; color: #3c4043; text-decoration: none;">
                                                            <span aria-hidden="true"></span>
                                                            <table border="0" cellspacing="0" cellpadding="0"
                                                                width="100%" style="padding-bottom: 4px;">
                                                                <tbody>
                                                                    <tr>
                                                                        <td>
                                                                            <h2
                                                                                style="font-size: 14px; color: #3c4043; text-decoration: none; font-weight: 700; margin: 0; padding: 0;">
                                                                                Event name</h2>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            <span>${eventname}</span>
                                                        </div>
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td
                                                        style="font-size: 0; padding: 0; text-align: left; word-break: break-word; padding-bottom: 24px;">
                                                        <div
                                                            style="font-style: normal; font-weight: 400; font-size: 14px; line-height: 20px; letter-spacing: 0.2px; color: #3c4043; text-decoration: none;">
                                                            <span aria-hidden="true"></span>
                                                            <table border="0" cellspacing="0" cellpadding="0"
                                                                width="100%" style="padding-bottom: 4px;">
                                                                <tbody>
                                                                    <tr>
                                                                        <td>
                                                                            <h2
                                                                                style="font-size: 14px; color: #3c4043; text-decoration: none; font-weight: 700; margin: 0; padding: 0;">
                                                                                Package name</h2>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            <span>
                                                            <ul>
                                                            ${packagename.map((packages) => {
        return (
            `<li>     
                                                                        ${packages.name}
                                                                    </li><br/>`
        )
    }).join('')
        }
                                                            </ul>
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td
                                                        style="font-size: 0; padding: 0; text-align: left; word-break: break-word; padding-bottom: 24px;">
                                                        <div
                                                            style="font-style: normal; font-weight: 400; font-size: 14px; line-height: 20px; letter-spacing: 0.2px; color: #3c4043; text-decoration: none;">
                                                            <table border="0" cellspacing="0" cellpadding="0"
                                                                width="100%" style="padding-bottom: 4px;">
                                                                <tbody>
                                                                    <tr>
                                                                        <td>
                                                                            <h2
                                                                                style="font-size: 14px; color: #3c4043; text-decoration: none; font-weight: 700; margin: 0; padding: 0;">
                                                                                Guests</h2>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            <div
                                                                style="padding-bottom: 4px; text-align: left; color: #3c4042;">
                                                                <div>
                                                                    <span>
                                                                        <span class="notranslate">
                                                                            <a style="display: inline-block; color: #3c4043; text-decoration: none;"
                                                                                href="mailto:${email.organizationMail}"
                                                                                target="_blank">${email.organizationMail}</a>
                                                                        </span>
                                                                        <span></span>
                                                                        <span
                                                                            style="color: #70757a; text-decoration: none;">-
                                                                            organiser</span>
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <span>
                                                                        <span class="notranslate">
                                                                            <a style="display: inline-block; color: #3c4043; text-decoration: none;"
                                                                                href="mailto:${email.customerMail}"
                                                                                target="_blank">${email.customerMail}</a>
                                                                        </span>
                                                                    </span>
                                                                    <span
                                                                        style="color: #70757a; text-decoration: none;"></span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
</body>
</html>
    `;

    const mailOptions = {
        to: sendMailTo,
        from: "info@dhora.app",
        subject: `Dhora – Meeting`,
        html,
    };

    try {
        await mailClient.send(mailOptions);
        return true;
    } catch (err) {
        console.log(err)
        throw new Error("Enable to send email");
    }
}
