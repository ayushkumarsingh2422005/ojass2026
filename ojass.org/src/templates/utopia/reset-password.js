const getResetPasswordTemplate = (otp) => {
    return `<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <title>OJASS 2026 Password Reset</title>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <style>
        body {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            font-family: 'Segoe UI', 'Inter', Arial, sans-serif;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 420px;
            margin: 42px auto;
            background: #ffffff;
            border-radius: 18px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .banner {
            position: relative;
            width: 100%;
            height: 120px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .banner-img {
            position: absolute;
            top: 0; left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            z-index: 1;
            opacity: 0.3;
        }
        .logo-banner {
            position: relative;
            z-index: 2;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
        }
        .logo {
            width: 62px;
            height: auto;
            filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.5));
            background: rgba(255, 255, 255, 0.2);
            border-radius: 14px;
            padding: 7px;
        }
        .fest-title {
            font-size: 1.20rem;
            font-weight: 700;
            color: #667eea;
            letter-spacing: 2px;
            text-transform: uppercase;
            text-align: center;
            margin: 7px 0 2px 0;
        }
        .content {
            padding: 30px 24px 20px 24px;
            text-align: center;
        }
        .content h2 {
            color: #667eea;
            font-size: 1.08rem;
            font-weight: 700;
            margin: 10px 0 18px 0;
            letter-spacing: 1px;
            font-family: 'Segoe UI', 'Inter', Arial, sans-serif;
        }
        .otp-box {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #fff;
            font-size: 2rem;
            font-family: 'Share Tech Mono', 'Courier New', monospace;
            font-weight: bold;
            padding: 13px 22px;
            margin: 18px 0 16px 0;
            border-radius: 8px;
            letter-spacing: 14px;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
        .msg {
            font-size: 1rem;
            color: #555;
            margin-bottom: 8px;
            line-height: 1.5;
        }
        .warning {
            font-size: 1.01rem;
            color: #667eea;
            margin-bottom: 10px;
            font-weight: 600;
        }
        .footer {
            padding: 20px 10px 16px 10px;
            text-align: center;
            background: #f8f9fa;
            font-size: 0.97rem;
            color: #667eea;
            border-top: 2px solid #e9ecef;
        }
        .footer a { color: #667eea; text-decoration: underline; }
        @media (max-width: 500px) {
            .email-container { max-width: 99vw; margin: 6vw auto; }
            .banner { height: 72px; }
            .logo { width: 40px; padding: 4px;}
        }
    </style>
</head>
<body>
    <div class='email-container'>
        <!-- Banner section with logo inside image -->
        <div class='banner'>
            <img src='https://img.freepik.com/premium-photo/futuristic-city-with-neon-lights-flying-vehicles-futuristic-urban-landscape_1198230-6283.jpg' alt='OJASS 2026 Banner' class='banner-img'>
            <div class='logo-banner'>
                <img src='https://data.digicraft.one/Logo/Main.png' alt='OJASS 2026 Logo' class='logo'>
            </div>
        </div>
        <div class='fest-title'>OJASS 2026</div>
        <div class='content'>
            <h2>Reset Your Password</h2>
            <div class='msg'>Welcome to OJASS 2026.<br>To reset your password, enter the code below:</div>
            <div class='otp-box'>${otp}</div>
            <div class='warning'>This code will expire in 10 minutes.</div>
            <div class='msg'>If you didn't request this, please ignore this email.</div>
        </div>
        <div class='footer'>
            Need support? Contact <a href='mailto:support@ojassfest.com'>support@ojassfest.com</a>
        </div>
    </div>
</body>
</html>`;
};

export default getResetPasswordTemplate;
