import { config } from "@/config";
import { mailClient } from "@/lib/sendgrid";

export async function sendInvoiceEmail(
  title: string,
  invoice: { paymentLink: string; to: string; pdf: string }
) {
 
  const html = `<!DOCTYPE html>
    <html
    xmlns="http://www.w3.org/1999/xhtml"
    xmlns:v="urn:schemas-microsoft-com:vml"
    xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
        <title> </title>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style type="text/css">
        #outlook a {
            padding: 0;
        }
        body {
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        table,
        td {
            border-collapse: collapse;
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }
        img {
            border: 0;
            height: 72px;
            width: 72px;
            outline: none;
            text-decoration: none;
            -ms-interpolation-mode: bicubic;
        }
        p {
            display: block;
            margin: 13px 0;
        }
        </style>
        <style type="text/css">
        .outlook-group-fix {
            width: 100% !important;
        }
        </style>
        <link
        href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700"
        rel="stylesheet"
        type="text/css" />
        <style type="text/css">
        @import url(https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700);
        </style>
        <style type="text/css">
        @media only screen and (min-width: 480px) {
            .mj-column-per-100 {
            width: 100% !important;
            max-width: 100%;
            }
        }
        </style>
        <style type="text/css">
        @media only screen and (max-width: 480px) {
            table.full-width-mobile {
            width: 100% !important;
            }
            td.full-width-mobile {
            width: auto !important;
            }
        }
        </style>
        <style type="text/css">
        * {
            text-rendering: optimizeLegibility;
            -moz-osx-font-smoothing: grayscale;
            font-smoothing: antialiased;
            -webkit-font-smoothing: antialiased;
        }
        .type-cta {
            user-select: none;
        }
        .type-nostyle {
            text-decoration: none;
        }
        p {
            margin-top: 0;
        }
        </style>
    </head>
    <body style="background-color: white">
        <div style="background-color: white">
        <table
            align="center"
            border="0"
            cellpadding="0"
            cellspacing="0"
            class=""
            style="width: 520px"
            width="520">
            <tr>
            <td
                style="
                line-height: 0px;
                font-size: 0px;
                mso-line-height-rule: exactly;
                ">
                <div style="margin: 0px auto; max-width: 520px">
                <table
                    align="center"
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    role="presentation"
                    style="width: 100%">
                    <tbody>
                    <tr>
                        <td
                        style="
                            direction: ltr;
                            font-size: 0px;
                            padding: 64px 10% 12px 10%;
                            text-align: center;
                        ">
                        <table
                            role="presentation"
                            border="0"
                            cellpadding="0"
                            cellspacing="0">
                            <tr>
                            <td
                                class=""
                                style="vertical-align: top; width: 500px">
                                <div
                                class="mj-column-per-100 outlook-group-fix"
                                style="
                                    font-size: 0px;
                                    text-align: left;
                                    direction: ltr;
                                    display: inline-block;
                                    vertical-align: top;
                                    width: 100%;
                                ">
                                <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    role="presentation"
                                    style="vertical-align: top"
                                    width="100%">
                                    <tr>
                                    <td
                                        align="center"
                                        style="
                                        font-size: 0px;
                                        padding: 0;
                                        word-break: break-word;
                                        ">
                                        <table
                                        border="0"
                                        cellpadding="0"
                                        cellspacing="0"
                                        role="presentation"
                                        style="
                                            border-collapse: collapse;
                                            border-spacing: 0px;
                                        ">
                                        <tbody>
                                            <tr>
                                            <td style="width: 54px">
                                                <a
                                                href="${config.env.HOST_URL}"
                                                target="_blank"
                                                ><img src="https://cdn.dhora.app/public/assets/logoTransparent.png"
                                                /></a>
                                            </td>
                                            </tr>
                                        </tbody>
                                        </table>
                                    </td>
                                    </tr>
                                </table>
                                </div>
                            </td>
                            </tr>
                        </table>
                        </td>
                    </tr>
                    </tbody>
                </table>
                </div>
            </td>
            </tr>
        </table>
        <table
            align="center"
            border="0"
            cellpadding="0"
            cellspacing="0"
            class=""
            style="width: 520px"
            width="520">
            <tr>
            <td
                style="
                line-height: 0px;
                font-size: 0px;
                mso-line-height-rule: exactly;
                ">
                <div style="margin: 0px auto; max-width: 520px">
                <table
                    align="center"
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    role="presentation"
                    style="width: 100%">
                    <tbody>
                    <tr>
                        <td
                        style="
                            direction: ltr;
                            font-size: 0px;
                            padding: 12px 10% 4px 10%;
                            text-align: center;
                        ">
                        <table
                            role="presentation"
                            border="0"
                            cellpadding="0"
                            cellspacing="0">
                            <tr>
                            <td
                                class=""
                                style="vertical-align: top; width: 500px">
                                <div
                                class="mj-column-per-100 outlook-group-fix"
                                style="
                                    font-size: 0px;
                                    text-align: left;
                                    direction: ltr;
                                    display: inline-block;
                                    vertical-align: top;
                                    width: 100%;
                                ">
                                <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    role="presentation"
                                    style="vertical-align: top"
                                    width="100%">
                                    <tr>
                                    <td
                                        align="center"
                                        style="
                                        font-size: 0px;
                                        padding: 8px 0 0 0;
                                        word-break: break-word;
                                        ">
                                        <div
                                        style="
                                            font-family: -apple-system,
                                            BlinkMacSystemFont, Helvetica, Arial,
                                            sans-serif;
                                            font-size: 22px;
                                            font-weight: 600;
                                            line-height: 1.2;
                                            text-align: center;
                                            color: #000000;
                                        ">
                                        ${title}
                                        </div>
                                    </td>
                                    </tr>
                                </table>
                                </div>
                            </td>
                            </tr>
                        </table>
                        </td>
                    </tr>
                    </tbody>
                </table>
                </div>
            </td>
            </tr>
        </table>
        <table
            align="center"
            border="0"
            cellpadding="0"
            cellspacing="0"
            class=""
            style="width: 520px"
            width="520">
            <tr>
            <td
                style="
                line-height: 0px;
                font-size: 0px;
                mso-line-height-rule: exactly;
                ">
                <div style="margin: 0px auto; max-width: 520px">
                <table
                    align="center"
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    role="presentation"
                    style="width: 100%">
                    <tbody>
                    <tr>
                        <td
                        style="
                            direction: ltr;
                            font-size: 0px;
                            padding: 12px 10% 0 10%;
                            text-align: center;
                        ">
                        <table
                            role="presentation"
                            border="0"
                            cellpadding="0"
                            cellspacing="0">
                            <tr>
                            <td
                                class=""
                                style="vertical-align: top; width: 500px">
                                <div
                                class="mj-column-per-100 outlook-group-fix"
                                style="
                                    font-size: 0px;
                                    text-align: left;
                                    direction: ltr;
                                    display: inline-block;
                                    vertical-align: top;
                                    width: 100%;
                                ">
                                <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    role="presentation"
                                    style="vertical-align: top"
                                    width="100%">
                                    <tr>
                                    <td
                                        align="left"
                                        style="
                                        font-size: 0px;
                                        padding: 8px 0 16px 0;
                                        word-break: break-word;
                                        ">
                                        <div
                                        style="
                                            font-family: -apple-system,
                                            BlinkMacSystemFont, Helvetica, Arial,
                                            sans-serif;
                                            font-size: 18px;
                                            font-weight: 600;
                                            line-height: 1.4;
                                            text-align: left;
                                            color: #8e8e92;
                                        ">
                                        <span style="color: #000000"
                                            >You just got an Invoice.</span
                                        >
                                        Please click on the button below to pay. We don't spam.
                                        </div>
                                    </td>
                                    </tr>
                                    <tr>
                                    <td
                                        style="
                                        font-size: 0px;
                                        word-break: break-word;
                                        ">
                                        <table
                                        role="presentation"
                                        border="0"
                                        cellpadding="0"
                                        cellspacing="0">
                                        <tr>
                                            <td
                                            height="8"
                                            style="
                                                vertical-align: top;
                                                height: 8px;
                                            ">
                                            <div style="height: 8px">&nbsp;</div>
                                            </td>
                                        </tr>
                                        </table>
                                    </td>
                                    </tr>
                                    <tr>
                                    <td
                                        align="left"
                                        vertical-align="middle"
                                        class="type-cta"
                                        style="
                                        font-size: 0px;
                                        padding: 8px 0;
                                        word-break: break-word;
                                        ">
                                        <table
                                        border="0"
                                        cellpadding="0"
                                        cellspacing="0"
                                        role="presentation"
                                        style="
                                            border-collapse: separate;
                                            line-height: 100%;
                                        ">
                                        <tr>
                                            <td
                                            align="center"
                                            bgcolor="#000000"
                                            role="presentation"
                                            style="
                                                border: none;
                                                border-radius: 6px;
                                                cursor: auto;
                                                mso-padding-alt: 12px 12px;
                                                background: #000000;
                                            "
                                            valign="middle"></td>
                                        </tr>
                                        </table>
                                    </td>
                                    </tr>
                                </table>
                                </div>
                            </td>
                            </tr>
                        </table>
                        </td>
                    </tr>
                    </tbody>
                </table>
                </div>
            </td>
            </tr>
        </table>
        <table
            align="center"
            border="0"
            cellpadding="0"
            cellspacing="0"
            class=""
            style="width: 520px"
            width="520">
            <tr>
            <td
                style="
                line-height: 0px;
                font-size: 0px;
                mso-line-height-rule: exactly;
                ">
                <div style="margin: 0px auto; max-width: 520px">
                <table
                    align="center"
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    role="presentation"
                    style="width: 100%">
                    <tbody>
                    <tr>
                        <td
                        style="
                            direction: ltr;
                            font-size: 0px;
                            padding: 12px 10% 4px 10%;
                            text-align: center;
                        ">
                        <table
                            role="presentation"
                            border="0"
                            cellpadding="0"
                            cellspacing="0">
                            <tr>
                            <td
                                class=""
                                style="vertical-align: top; width: 500px">
                                <div
                                class="mj-column-per-100 outlook-group-fix"
                                style="
                                    font-size: 0px;
                                    text-align: left;
                                    direction: ltr;
                                    display: inline-block;
                                    vertical-align: top;
                                    width: 100%;
                                ">
                                <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    role="presentation"
                                    style="vertical-align: top"
                                    width="100%">
                                    <tr>
                                    <td
                                        align="center"
                                        style="
                                        font-size: 0px;
                                        padding: 8px 0 0 0;
                                        word-break: break-word;
                                        ">
                                        <a
                                          href="${invoice.paymentLink}"
                                          target="_blank"
                                        ><button 
                                            style="
                                                font-family: -apple-system, BlinkMacSystemFont, Helvetica, Arial,
                                                sans-serif;
                                                font-weight: 600;
                                                line-height: 1.2;
                                                border: none;
                                                padding: 10px;
                                                border-radius: 20px;
                                                text-align: center;
                                                color: #fff;
                                                background-color: #1e3b8a;
                                            "
                                        >Pay Now</button>
                                        </a>

                                    </td>
                                    </tr>
                                </table>
                                </div>
                            </td>
                            </tr>
                        </table>
                        </td>
                    </tr>
                    </tbody>
                </table>
                </div>
            </td>
            </tr>
        </table>
        <table
            align="center"
            border="0"
            cellpadding="0"
            cellspacing="0"
            class=""
            style="width: 520px"
            width="520">
            <tr>
            <td
                style="
                line-height: 0px;
                font-size: 0px;
                mso-line-height-rule: exactly;
                ">
                <div style="margin: 0px auto; max-width: 520px">
                <table
                    align="center"
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    role="presentation"
                    style="width: 100%">
                    <tbody>
                    <tr>
                        <td
                        style="
                            direction: ltr;
                            font-size: 0px;
                            padding: 50px 16px 32px 16px;
                            text-align: center;
                        ">
                        <table
                            role="presentation"
                            border="0"
                            cellpadding="0"
                            cellspacing="0">
                            <tr>
                            <td
                                class=""
                                style="vertical-align: top; width: 488px">
                                <div
                                class="mj-column-per-100 outlook-group-fix"
                                style="
                                    font-size: 0px;
                                    text-align: left;
                                    direction: ltr;
                                    display: inline-block;
                                    vertical-align: top;
                                    width: 100%;
                                ">
                                <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    role="presentation"
                                    style="vertical-align: top"
                                    width="100%">
                                    <tr>
                                    <td
                                        align="center"
                                        style="
                                        font-size: 0px;
                                        padding: 10px 25px;
                                        word-break: break-word;
                                        "></td>
                                    </tr>
                                    <tr>
                                    <td
                                        align="center"
                                        vertical-align="middle"
                                        style="
                                        font-size: 0px;
                                        padding: 0;
                                        padding-top: 4px;
                                        word-break: break-word;
                                        ">
                                        <table
                                        border="0"
                                        cellpadding="0"
                                        cellspacing="0"
                                        role="presentation"
                                        style="
                                            border-collapse: separate;
                                            line-height: 100%;
                                        ">
                                        <tr>
                                            <td
                                            align="center"
                                            role="presentation"
                                            style="
                                                border: none;
                                                border-radius: 3px;
                                                cursor: auto;
                                                mso-padding-alt: 4px 0;
                                                background: none;
                                            "
                                            valign="middle">
                                            <a
                                                href="${config.env.HOST_URL}"
                                                style="
                                                display: inline-block;
                                                background: none;
                                                color: #8e8e92;
                                                font-family: -apple-system,
                                                    BlinkMacSystemFont, Helvetica,
                                                    Arial, sans-serif;
                                                font-size: 11px;
                                                font-weight: 500;
                                                line-height: 1.4;
                                                margin: 0;
                                                text-decoration: none;
                                                text-transform: none;
                                                padding: 4px 0;
                                                mso-padding-alt: 0px;
                                                border-radius: 3px;
                                                "
                                                target="_blank"
                                                >©2024 Dhora</a
                                            >
                                            </td>
                                        </tr>
                                        </table>
                                    </td>
                                    </tr>
                                </table>
                                </div>
                            </td>
                            </tr>
                        </table>
                        </td>
                    </tr>
                    </tbody>
                </table>
                </div>
            </td>
            </tr>
        </table>
        </div>
        <br />
    </body>
    </html>
    `;

  try {
    await mailClient.send({
      to: invoice.to,
      from: "info@dhora.app",
      subject: `Dhora – Email Verification`,
      html,
      attachments: [
        {
          filename: "invoice.pdf",
          type: "pdf",
          content: invoice.pdf,
        },
      ],
    });
    return true;
  } catch (err) {
    throw new Error("Enable to send email");
  }
}
