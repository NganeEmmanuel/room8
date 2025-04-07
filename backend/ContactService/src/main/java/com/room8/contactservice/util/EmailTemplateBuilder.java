package com.room8.contactservice.util;

/**
 * Builds HTML templates for verification emails.
 */
public class EmailTemplateBuilder {

    public static String buildVerificationEmail(String email, String verificationLink) {
        return """
                <html>
                <head><style>
                    .container { font-family: Arial, sans-serif; max-width: 600px; margin: auto; }
                    .header { background-color: #4CAF50; padding: 20px; text-align: center; color: white; }
                    .footer { font-size: 12px; color: gray; text-align: center; padding: 10px; }
                    .button { background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; }
                </style></head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Room8</h1>
                        </div>
                        <p>Hi,</p>
                        <p>Please verify your email by clicking the button below:</p>
                        <p><a href="%s" class="button">Verify Email</a></p>
                        <p>If you didn't request this, you can safely ignore this email.</p>
                        <div class="footer">
                            <p>&copy; 2025 Room8 | <a href="https://room8.com">Visit our website</a></p>
                        </div>
                    </div>
                </body>
                </html>
                """.formatted(verificationLink);
    }
}
