<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Order Confirmation</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        /* General resets for email clients */
        body, table, td, a {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        table, td {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }
        img {
            -ms-interpolation-mode: bicubic;
        }

        /* Responsive styles */
        @media only screen and (max-width: 600px) {
            .email-container {
                width: 100% !important;
                padding: 0 10px !important;
            }

            .stack-column,
            .stack-column-center {
                display: block !important;
                width: 100% !important;
                max-width: 100% !important;
                direction: ltr !important;
            }

            .stack-column-center {
                text-align: center !important;
            }

            .mobile-padding {
                padding: 20px 10px !important;
            }

            .mobile-text-center {
                text-align: center !important;
            }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f4;">
        <tr>
            <td align="center">
                <table class="email-container" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; margin: 0 auto; border-radius: 6px; overflow: hidden;">
                    <!-- Header -->
                    <tr>
                        <td style="background-color: #6262aa; padding: 20px; text-align: center; color: #ffffff;">
                            <h1 style="margin: 0; font-size: 22px;">Thank You for Your Order!</h1>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td class="mobile-padding" style="padding: 30px;">
                            <p style="font-size: 16px; color: #333; margin: 0 0 20px;">
                                We're excited to let you know we've received your order. Below are your order details:
                            </p>

                            <!-- Order Details Table -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 15px; color: #333;">
                                <tr>
                                    <td style="padding: 8px 0; font-weight: bold;">Order Number:</td>
                                    <td style="padding: 8px 0;">#{{ $order->id ?? '123' }}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; font-weight: bold;">Order Date:</td>
                                    <td style="padding: 8px 0;">{{ $order->created_at ?? \Carbon\Carbon::now()->toFormattedDateString() }}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; font-weight: bold;">Total Amount:</td>
                                    <td style="padding: 8px 0;">${{ number_format($order->price ?? 0, 2) }}</td>
                                </tr>
                            </table>

                            <p style="font-size: 16px; color: #333; margin-top: 30px;">
                                Address: {{ $order->address }}
                            </p>

                            <p style="font-size: 16px; color: #333; margin-top: 30px;">
                                City: {{ $order->city }}
                            </p>

                            <p style="font-size: 16px; color: #333; margin-top: 30px;">
                                You will receive a notification once your order has shipped.
                            </p>

                            <p style="font-size: 16px; color: #333;">
                                Thank you for shopping with us!
                            </p>

                            <p style="font-size: 16px; color: #333; margin: 0;">— The {{ config('app.name') }} Team</p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #eaeaea; text-align: center; padding: 15px; font-size: 12px; color: #777;">
                            &copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
