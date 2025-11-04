const getResetPasswordTemplate = (otp) => {
    return `<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <title>OJASS 2026 Password Reset</title>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <style>
        body {
            background: #191a23;
            font-family: 'Segoe UI', 'Inter', Arial, sans-serif;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 420px;
            margin: 42px auto;
            background: #232433;
            border-radius: 18px;
            box-shadow: 0 8px 32px #1a162940;
            overflow: hidden;
            border: 2px solid #2e2c44;
        }
        .banner {
            position: relative;
            width: 100%;
            height: 120px;
            background: #292935;
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
            filter: grayscale(25%) drop-shadow(0 0 8px #ff357a);
            background: rgba(9, 9, 9, 0.133);
            border-radius: 14px;
            padding: 7px;
        }
        .fest-title {
            font-size: 1.20rem;
            font-weight: 700;
            color: #ff357a;
            letter-spacing: 2px;
            text-transform: uppercase;
            text-align: center;
            text-shadow: 0 0 4px #26204a;
            margin: 7px 0 2px 0;
        }
        .content {
            padding: 30px 24px 20px 24px;
            text-align: center;
        }
        .content h2 {
            color: #ff357a;
            font-size: 1.08rem;
            font-weight: 700;
            margin: 10px 0 18px 0;
            letter-spacing: 1px;
            font-family: 'Segoe UI', 'Inter', Arial, sans-serif;
        }
        .otp-box {
            display: inline-block;
            background: #111114;
            color: #fff;
            font-size: 2rem;
            font-family: 'Share Tech Mono', 'Courier New', monospace;
            font-weight: bold;
            padding: 13px 22px;
            margin: 18px 0 16px 0;
            border-radius: 8px;
            letter-spacing: 14px;
            border: 2.5px solid #ff357a;
            filter: drop-shadow(0 0 6px #ff357a33);
        }
        .msg {
            font-size: 1rem;
            color: #e6e6eb;
            margin-bottom: 8px;
        }
        .warning {
            font-size: 1.01rem;
            color: #ff357a;
            margin-bottom: 10px;
            font-weight: 600;
        }
        .footer {
            padding: 20px 10px 16px 10px;
            text-align: center;
            background: #20202f;
            font-size: 0.97rem;
            color: #ff357a;
            border-top: 2px solid #2e2c44;
        }
        .footer a { color: #ff357a; text-decoration: underline; }
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
            <img src='https://img.freepik.com/premium-photo/futuristic-robots-dystopian-future-city-ar-generative-ai_1198230-6283.jpg' alt='OJASS 2026 Banner' class='banner-img'>
            <div class='logo-banner'>
                <img src='https://data.digicraft.one/Logo/Main.png' alt='OJASS 2026 Logo' class='logo'>
            </div>
        </div>
        <div class='fest-title'>OJASS 2026</div>
        <div class='content'>
            <h2>Access Code for the Future</h2>
            <div class='msg'>Welcome to OJASS 2026.<br>To change your password, enter the code below:</div>
            <div class='otp-box'>${otp}</div>
            <div class='warning'>This OTP will self-destruct in 10 minutes.</div>
            <div class='msg'>Never share this code. In a world of surveillance, privacy is your power.</div>
        </div>
        <div class='footer'>
            Need support? Contact <a href='mailto:support@ojassfest.com'>support@ojassfest.com</a>
        </div>
    </div>
</body>
</html>`;
};

export default getResetPasswordTemplate;
