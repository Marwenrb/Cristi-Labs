import React, { useEffect } from 'react';
import './Privacy.css';

const Privacy = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="privacy-policy-container">
      <style>{`
        [data-custom-class='body'], [data-custom-class='body'] * {
          background: transparent !important;
        }
        [data-custom-class='title'], [data-custom-class='title'] * {
          font-family: Arial !important;
          font-size: 26px !important;
          color: #000000 !important;
        }
        [data-custom-class='subtitle'], [data-custom-class='subtitle'] * {
          font-family: Arial !important;
          color: #595959 !important;
          font-size: 14px !important;
        }
        [data-custom-class='heading_1'], [data-custom-class='heading_1'] * {
          font-family: Arial !important;
          font-size: 19px !important;
          color: #000000 !important;
        }
        [data-custom-class='heading_2'], [data-custom-class='heading_2'] * {
          font-family: Arial !important;
          font-size: 17px !important;
          color: #000000 !important;
        }
        [data-custom-class='body_text'], [data-custom-class='body_text'] * {
          color: #595959 !important;
          font-size: 14px !important;
          font-family: Arial !important;
        }
        [data-custom-class='link'], [data-custom-class='link'] * {
          color: #3030F1 !important;
          font-size: 14px !important;
          font-family: Arial !important;
          word-break: break-word !important;
        }
      `}</style>

      <div data-custom-class="body">
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{
            display: 'block',
            margin: '0 auto 3.125rem',
            width: '11.125rem',
            height: '2.375rem',
            backgroundImage: 'url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNzgiIGhlaWdodD0iMzgiIHZpZXdCb3g9IjAgMCAxNzggMzgiPgogICAgPGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8cGF0aCBmaWxsPSIjRDFEMUQxIiBkPSJNNC4yODMgMjQuMTA3Yy0uNzA1IDAtMS4yNTgtLjI1Ni0xLjY2LS43NjhoLS4wODVjLjA1Ny41MDIuMDg2Ljc5Mi4wODYuODd2Mi40MzRILjk4NXYtOC42NDhoMS4zMzJsLjIzMS43NzloLjA3NmMuMzgzLS41OTQuOTUtLjg5MiAxLjcwMi0uODkyLjcxIDAgMS4yNjQuMjc0IDEuNjY1LjgyMi40MDEuNTQ4LjYwMiAxLjMwOS42MDIgMi4yODMgMCAuNjQtLjA5NCAxLjE5OC0uMjgyIDEuNjctLjE4OC40NzMtLjQ1Ni44MzMtLjgwMyAxLjA4LS4zNDcuMjQ3LS43NTYuMzctMS4yMjUuMzd6TTMuOCAxOS4xOTNjLS40MDUgMC0uNy4xMjQtLjg4Ni4zNzMtLjE4Ny4yNDktLjI4My42Ni0uMjkgMS4yMzN2LjE3N2MwIC42NDUuMDk1IDEuMTA3LjI4NyAxLjM4Ni4xOTIuMjguNDk1LjQxOS45MS40MTkuNzM0IDAgMS4xMDEtLjYwNSAxLjEwMS0xLjgxNiAwLS41OS0uMDktMS4wMzQtLjI3LTEuMzI5LS4xODItLjI5NS0uNDY1LS40NDMtLjg1Mi0uNDQzem01LjU3IDEuNzk0YzAgLjU5NC4wOTggMS4wNDQuMjkzIDEuMzQ4LjE5Ni4zMDQuNTEzLjQ1Ny45NTQuNDU3LjQzNyAwIC43NS0uMTUyLjk0Mi0uNDU0LjE5Mi0uMzAzLjI4OC0uNzUzLjI4OC0xLjM1MSAwLS41OTUtLjA5Ny0xLjA0LS4yOS0xLjMzOC0uMTk0LS4yOTctLjUxLS40NDUtLjk1LS40NDUtLjQzOCAwLS43NTMuMTQ3LS45NDYuNDQzLS4xOTQuMjk1LS4yOS43NDItLjI5IDEuMzR6bTQuMTUzIDBjMCAuOTc3LS4yNTggMS43NDItLjc3NCAyLjI5My0uNTE1LjU1Mi0xLjIzMy44MjctMi4xNTQuODI3LS41NzYgMC0xLjA4NS0uMTI2LTEuNTI1LS4zNzhhMi41MiAyLjUyIDAgMCAxLTEuMDE1LTEuMDg4Yy0uMjM3LS40NzMtLjM1NS0xLjAyNC0uMzU1LTEuNjU0IDAtLjk4MS4yNTYtMS43NDQuNzY4LTIuMjg4LjUxMi0uNTQ1IDEuMjMyLS44MTcgMi4xNi0uODE3LjU3NiAwIDEuMDg1LjEyNiAxLjUyNS4zNzYuNDQuMjUxLjc3OS42MSAxLjAxNSAxLjA4LjIzNi40NjkuMzU1IDEuMDE5LjM1NSAxLjY0OXpNMTkuNzEgMjRsLS40NjItMi4xLS42MjMtMi42NTNoLS4wMzdsMTcuNDkzIDI0SDE1LjczbC0xLjcwOC02LjAwNWgxLjYzM2wuNjkzIDIuNjU5Yy4xMS40NzYuMjI0IDEuMTMzLjMzOCAxLjk3MWguMDMyYy4wMTUtLjI3Mi4wNzctLjcwNC4xODgtMS4yOTRsLjA4Ni0uNDU3Ljc0Mi0yLjg3OWgxLjgwNGwuNzA0IDIuODc5Yy4wMTQuMDc5LjAzNy4xOTUuMDY3LjM1YTIwLjk5OCAyMC45OTggMCAwIDEgLjE2NyAxLjAwMmMuMDIzLjE2NS4wMzYuMjk5LjA0LjM5OWguMDMyYy4wMzItLjI1OC4wOS0uNjExLjE3Mi0xLjA2LjA4Mi0uNDUuMTQxLS43NTQuMTc3LS45MTFsLjcyLTIuNjU5aDEuNjA2TDIxLjQ5NCAyNGgtMS43ODN6bTcuMDg2LTQuOTUyYy0uMzQ4IDAtLjYyLjExLS44MTcuMzMtLjE5Ny4yMi0uMzEuNTMzLS4zMzguOTM3aDIuMjk5Yy0uMDA4LS40MDQtLjExMy0uNzE3LS4zMTctLjkzNy0uMjA0LS4yMi0uNDgtLjMzLS44MjctLjMzem0uMjMgNS4wNmMtLjk2NiAwLTEuNzIyLS4yNjctMi4yNjYtLjgtLjU0NC0uNTM0LS44MTYtMS4yOS0uODE2LTIuMjY3IDAtMS4wMDcuMjUxLTEuNzg1Ljc1NC0yLjMzNC41MDMtLjU1IDEuMTk5LS44MjUgMi4wODctLjgyNS44NDggMCAxLjUxLjI0MiAxLjk4Mi43MjUuNDcyLjQ4NC43MDkgMS4xNTIuNzA5IDIuMDA0di43OTVoLTMuODczYy4wMTguNDY1LjE1Ni44MjkuNDE0IDEuMDkuMjU4LjI2MS42Mi4zOTIgMS4wODUuMzkyLjM2MSAwIC43MDMtLjAzNyAxLjAyNi0uMTEzYTUuMTMzIDUuMTMzIDAgMCAwIDEuMDEtLjM2djEuMjY4Yy0uMjg3LjE0My0uNTkzLjI1LS45Mi4zMmE1Ljc5IDUuNzkgMCAwIDEtMS4xOTEuMTA0em03LjI1My02LjIyNmMuMjIyIDAgLjQwNi4wMTYuNTUzLjA0OWwtLjEyNCAxLjUzNmExLjg3NyAxLjg3NyAwIDAgMC0uNDgzLS4wNTRjLS41MjMgMC0uOTMuMTM0LTEuMjIyLjQwMy0uMjkyLjI2OC0uNDM4LjY0NC0uNDM4IDEuMTI4VjI0aC0xLjYzOHYtNi4wMDVoMS4yNGwuMjQyIDEuMDFoLjA4Yy4xODctLjMzNy40MzktLjYwOC43NTYtLjgxNGExLjg2IDEuODYgMCAwIDEgMS4wMzQtLjMwOXptNC4wMjkgMS4xNjZjLS4zNDcgMC0uNjIuMTEtLjgxNy4zMy0uMTk3LjIyLS4zMS41MzMtLjMzOC45MzdoMi4yOTljLS4wMDctLjQwNC0uMTEzLS43MTctLjMxNy0uOTM3LS4yMDQtLjIyLS40OC0uMzMtLjgyNy0uMzN6bS4yMyA1LjA2Yy0uOTY2IDAtMS43MjItLjI2Ny0yLjI2Ni0uOC0uNTQ0LS41MzQtLjgxNi0xLjI5LS44MTYtMi4yNjcgMC0xLjAwNy4yNTEtMS43ODUuNzU0LTIuMzM0LjUwNC0uNTUgMS4yLS44MjUgMi4wODctLjgyNS44NDkgMCAxLjUxLjI0MiAxLjk4Mi43MjUuNDczLjQ4NC43MDkgMS4xNTIuNzA5IDIuMDA0di43OTVoLTMuODczYy4wMTguNDY1LjE1Ni44MjkuNDE0IDEuMDkuMjU4LjI2MS42Mi4zOTIgMS4wODUuMzkyLjM2MiAwIC43MDQtLjAzNyAxLjAyNi0uMTEzYTUuMTMzIDUuMTMzIDAgMCAwIDEuMDEtLjM2djEuMjY4Yy0uMjg3LjE0My0uNTkzLjI1LS45MTkuMzJhNS43OSA1Ljc5IDAgMCAxLTEuMTkyLjEwNHptNS44MDMgMGMtLjcwNiAwLTEuMjYtLjI3NS0xLjY2My0uODIyLS40MDMtLjU0OC0uNjA0LTEuMzA3LS42MDQtMi4yNzggMC0uOTg0LjIwNS0xLjc1Mi42MTUtMi4zMDEuNDEtLjU1Ljk3NS0uODI1IDEuNjk1LS44MjUuNzU1IDAgMS4zMzIuMjk0IDEuNzI5Ljg4MWguMDU0YTYuNjk3IDYuNjk3IDAgMCAxLS4xMjQtMS4xOTh2LTEuOTIyaDEuNjQ0VjI0SDQ2LjQzbC0uMzE3LS43NzloLS4wN2MtLjM3Mi41OTEtLjk0Ljg4Ni0xLjcwMi44ODZ6bS41NzQtMS4zMDZjLjQyIDAgLjcyNi0uMTIxLjkyMS0uMzY1LjE5Ni0uMjQzLjMwMi0uNjU3LjMyLTEuMjR2LS4xNzhjMC0uNjQ0LS4xLTEuMTA2LS4yOTgtMS4zODYtLjE5OS0uMjc5LS41MjItLjQxOS0uOTctLjQxOWEuOTYyLjk2MiAwIDAgMC0uODUuNDY1Yy0uMjAzLjMxLS4zMDQuNzYtLjMwNCAxLjM1IDAgLjU5Mi4xMDIgMS4wMzUuMzA2IDEuMzMuMjA0LjI5Ni40OTYuNDQzLjg3NS40NDN6bTEwLjkyMi00LjkyYy43MDkgMCAxLjI2NC4yNzcgMS42NjUuODMuNC41NTMuNjAxIDEuMzEyLjYwMSAyLjI3NSAwIC45OTItLjIwNiAxLjc2LS42MiAyLjMwNC0uNDE0LjU0NC0uOTc3LjgxNi0xLjY5LjgxNi0uNzA1IDAtMS4yNTgtLjI1Ni0xLjY1OS0uNzY4aC0uMTEzbC0uMjc0LjY2MWgtMS4yNTF2LTguMzU3aDEuNjM4djEuOTQ0YzAgLjI0Ny0uMDIxLjY0My0uMDY0IDEuMTg3aC4wNjRjLjM4My0uNTk0Ljk1LS44OTIgMS43MDMtLjg5MnptLS41MjcgMS4zMWMtLjQwNCAwLS43LjEyNS0uODg2LjM3NC0uMTg2LjI0OS0uMjgzLjY2LS4yOSAxLjIzM3YuMTc3YzAgLjY0NS4wOTYgMS4xMDcuMjg3IDEuMzg2LjE5Mi4yOC40OTUuNDE5LjkxLjQxOS4zMzcgMCAuNjA1LS4xNTUuODA0LS40NjUuMTk5LS4zMS4yOTgtLjc2LjI5OC0xLjM1IDAtLjU5MS0uMS0xLjAzNS0uMy0xLjMzYS45NDMuOTQzIDAgMCAwLS44MjMtLjQ0M3ptMy4xODYtMS4xOTdoMS43OTRsMS4xMzQgMy4zNzljLjA5Ni4yOTMuMTYzLjY0LjE5OCAxLjA0MmguMDMzYy4wMzktLjM3LjExNi0uNzE3LjIzLTEuMDQybDEuMTEyLTMuMzc5aDEuNzU3bC0yLjU0IDYuNzczYy0uMjM0LjYyNy0uNTY2IDEuMDk2LS45OTcgMS40MDctLjQzMi4zMTItLjkzNi40NjgtMS41MTIuNDY4LS4yODMgMC0uNTYtLjAzLS44MzMtLjA5MnYtMS4zYTIuOCAyLjggMCAwIDAgLjY0NS4wN2MuMjkgMCAuNTQzLS4wODguNzYtLjI2Ni4yMTctLjE3Ny4zODYtLjQ0NC41MDgtLjgwM2wuMDk2LS4yOTUtMi4zODUtNS45NjJ6Ii8+CiAgICAgICAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNzMpIj4KICAgICAgICAgICAgPGNpcmNsZSBjeD0iMTkiIGN5PSIxOSIgcj0iMTkiIGZpbGw9IiNFMEUwRTAiLz4KICAgICAgICAgICAgPHBhdGggZmlsbD0iI0ZGRiIgZD0iTTIyLjQ3NCAxNS40NDNoNS4xNjJMMTIuNDM2IDMwLjRWMTAuMzYzaDE1LjJsLTUuMTYyIDUuMDh6Ii8+CiAgICAgICAgPC9nPgogICAgICAgIDxwYXRoIGZpbGw9IiNEMkQyRDIiIGQ9Ik0xMjEuNTQ0IDE0LjU2di0xLjcyOGg4LjI3MnYxLjcyOGgtMy4wMjRWMjRoLTIuMjR2LTkuNDRoLTMuMDA4em0xMy43NDQgOS41NjhjLTEuMjkgMC0yLjM0MS0uNDE5LTMuMTUyLTEuMjU2LS44MS0uODM3LTEuMjE2LTEuOTQ0LTEuMjE2LTMuMzJzLjQwOC0yLjQ3NyAxLjIyNC0zLjMwNGMuODE2LS44MjcgMS44NzItMS4yNCAzLjE2OC0xLjI0czIuMzYuNDAzIDMuMTkyIDEuMjA4Yy44MzIuODA1IDEuMjQ4IDEuODggMS4yNDggMy4yMjQgMCAuMzEtLjAyMS41OTctLjA2NC44NjRoLTYuNDY0Yy4wNTMuNTc2LjI2NyAxLjA0LjY0IDEuMzkyLjM3My4zNTIuODQ4LjUyOCAxLjQyNC41MjguNzc5IDAgMS4zNTUtLjMyIDEuNzI4LS45NmgyLjQzMmEzLjg5MSAzLjg5MSAwIDAgMS0xLjQ4OCAyLjA2NGMtLjczNi41MzMtMS42MjcuOC0yLjY3Mi44em0xLjQ4LTYuNjg4Yy0uNC0uMzUyLS44ODMtLjUyOC0xLjQ0OC0uNTI4cy0xLjAzNy4xNzYtMS40MTYuNTI4Yy0uMzc5LjM1Mi0uNjA1LjgyMS0uNjggMS40MDhoNC4xOTJjLS4wMzItLjU4Ny0uMjQ4LTEuMDU2LS42NDgtMS40MDh6bTcuMDE2LTIuMzA0djEuNTY4Yy41OTctMS4xMyAxLjQ2MS0xLjY5NiAyLjU5Mi0xLjY5NnYyLjMwNGgtLjU2Yy0uNjcyIDAtMS4xNzkuMTY4LTEuNTIuNTA0LS4zNDEuMzM2LS41MTIuOTE1LS41MTIgMS43MzZWMjRoLTIuMjU2di04Ljg2NGgyLjI1NnptNi40NDggMHYxLjMyOGMuNTY1LS45NyAxLjQ4My0xLjQ1NiAyLjc1Mi0xLjQ1Ni42NzIgMCAxLjI3Mi4xNTUgMS44LjQ2NC41MjguMzEuOTM2Ljc1MiAxLjIyNCAxLjMyOC4zMS0uNTU1LjczMy0uOTkyIDEuMjcyLTEuMzEyYTMuNDg4IDMuNDg4IDAgMCAxIDEuODE2LS40OGMxLjA1NiAwIDEuOTA3LjMzIDIuNTUyLjk5Mi42NDUuNjYxLjk2OCAxLjU5Ljk2OCAyLjc4NFYyNGgtMi4yNHYtNC44OTZjMC0uNjkzLS4xNzYtMS4yMjQtLjUyOC0xLjU5Mi0uMzUyLS4zNjgtLjgzMi0uNTUyLTEuNDQtLjU1MnMtMS4wOS4xODQtMS40NDguNTUyYy0uMzU3LjM2OC0uNTM2Ljg5OS0uNTM2IDEuNTkyVjI0aC0yLjI0di00Ljg5NmMwLS42OTMtLjE3Ni0xLjIyNC0uNTI4LTEuNTkyLS4zNTItLjM2OC0uODMyLS41NTItMS40NC0uNTUycy0xLjA5LjE4NC0xLjQ0OC41NTJjLS4zNTcuMzY4LS41MzYuODk5LS41MzYgMS41OTJWMjRoLTIuMjU2di04Ljg2NGgyLjI1NnpNMTY0LjkzNiAyNFYxMi4xNmgyLjI1NlYyNGgtMi4yNTZ6bTcuMDQtLjE2bC0zLjQ3Mi04LjcwNGgyLjUyOGwyLjI1NiA2LjMwNCAyLjM4NC02LjMwNGgyLjM1MmwtNS41MzYgMTMuMDU2aC0yLjM1MmwxLjg0LTQuMzUyeiIvPgogICAgPC9nPgo8L3N2Zz4K)',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }} />
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h1 data-custom-class="title" style={{ marginBottom: '0.5rem' }}>PRIVACY POLICY</h1>
          <p data-custom-class="subtitle" style={{ color: '#595959', fontSize: '15px' }}>
            Last updated <strong>May 19, 2026</strong>
          </p>
        </div>

        {/* Introduction */}
        <div style={{ marginBottom: '2rem', lineHeight: '1.5' }}>
          <p data-custom-class="body_text">
            This Privacy Notice for <strong>Cristi Labs</strong> ("<strong>we</strong>," "<strong>us</strong>," or "<strong>our</strong>"), describes how and why we might access, collect, store, use, and/or share ("<strong>process</strong>") your personal information when you use our services ("<strong>Services</strong>"), including when you:
          </p>
          <ul style={{ marginLeft: '2rem' }}>
            <li data-custom-class="body_text">Visit our website at <a data-custom-class="link" href="https://cristilabs.net" target="_blank" rel="noopener noreferrer">https://cristilabs.net</a> or any website of ours that links to this Privacy Notice</li>
            <li data-custom-class="body_text">Download and use our mobile application (Cristi Labs) or any other application of ours that links to this Privacy Notice</li>
            <li data-custom-class="body_text">Use Cristi Labs. Orchestrating Real-World Asset liquidity, the Aura Protocol, and neuromorphic web ecosystems — where physical commerce and immersive experience converge.</li>
            <li data-custom-class="body_text">Engage with us in other related ways, including any marketing or events</li>
          </ul>
          <p data-custom-class="body_text" style={{ marginTop: '1rem' }}>
            <strong>Questions or concerns?</strong> Reading this Privacy Notice will help you understand your privacy rights and choices. We are responsible for making decisions about how your personal information is processed. If you do not agree with our policies and practices, please do not use our Services. If you still have any questions or concerns, please contact us at <a data-custom-class="link" href="mailto:access@cristilabs.net">access@cristilabs.net</a>.
          </p>
        </div>

        {/* Table of Contents */}
        <div style={{ marginBottom: '2rem', lineHeight: '1.5' }}>
          <h2 data-custom-class="heading_1">TABLE OF CONTENTS</h2>
          <div style={{ marginTop: '1rem' }}>
            <a data-custom-class="link" href="#infocollect" style={{ display: 'block', marginBottom: '0.5rem' }}>1. WHAT INFORMATION DO WE COLLECT?</a>
            <a data-custom-class="link" href="#infouse" style={{ display: 'block', marginBottom: '0.5rem' }}>2. HOW DO WE PROCESS YOUR INFORMATION?</a>
            <a data-custom-class="link" href="#legalbases" style={{ display: 'block', marginBottom: '0.5rem' }}>3. WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR PERSONAL INFORMATION?</a>
            <a data-custom-class="link" href="#whoshare" style={{ display: 'block', marginBottom: '0.5rem' }}>4. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?</a>
            <a data-custom-class="link" href="#inforetain" style={{ display: 'block', marginBottom: '0.5rem' }}>5. HOW LONG DO WE KEEP YOUR INFORMATION?</a>
            <a data-custom-class="link" href="#infosafe" style={{ display: 'block', marginBottom: '0.5rem' }}>6. HOW DO WE KEEP YOUR INFORMATION SAFE?</a>
            <a data-custom-class="link" href="#infominors" style={{ display: 'block', marginBottom: '0.5rem' }}>7. DO WE COLLECT INFORMATION FROM MINORS?</a>
            <a data-custom-class="link" href="#privacyrights" style={{ display: 'block', marginBottom: '0.5rem' }}>8. WHAT ARE YOUR PRIVACY RIGHTS?</a>
            <a data-custom-class="link" href="#contact" style={{ display: 'block', marginBottom: '0.5rem' }}>9. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</a>
            <a data-custom-class="link" href="#request" style={{ display: 'block' }}>10. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?</a>
          </div>
        </div>

        {/* Key Sections */}
        <section id="infocollect" style={{ marginBottom: '3rem' }}>
          <h2 data-custom-class="heading_1" style={{ marginBottom: '1rem' }}>1. WHAT INFORMATION DO WE COLLECT?</h2>
          <h3 data-custom-class="heading_2">Personal information you disclose to us</h3>
          <p data-custom-class="body_text"><strong><em>In Short:</em></strong> <em>We collect personal information that you provide to us.</em></p>
          <p data-custom-class="body_text">We collect personal information that you voluntarily provide to us when you express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.</p>
          <p data-custom-class="body_text"><strong>Personal Information Provided by You.</strong> The personal information that we collect depends on the context of your interactions with us and the Services, the choices you make, and the products and features you use. The personal information we collect may include the following:</p>
          <ul style={{ marginLeft: '2rem' }}>
            <li data-custom-class="body_text">Names</li>
            <li data-custom-class="body_text">Phone numbers</li>
            <li data-custom-class="body_text">Email addresses</li>
            <li data-custom-class="body_text">Mailing addresses</li>
            <li data-custom-class="body_text">Job titles</li>
            <li data-custom-class="body_text">Contact preferences</li>
          </ul>
          <p data-custom-class="body_text" style={{ marginTop: '1rem' }}><strong>Sensitive Information.</strong> We do not process sensitive information.</p>
          <p data-custom-class="body_text">All personal information that you provide to us must be true, complete, and accurate, and you must notify us of any changes to such personal information.</p>
        </section>

        <section id="infouse" style={{ marginBottom: '3rem' }}>
          <h2 data-custom-class="heading_1" style={{ marginBottom: '1rem' }}>2. HOW DO WE PROCESS YOUR INFORMATION?</h2>
          <p data-custom-class="body_text"><strong><em>In Short:</em></strong> <em>We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes only with your prior explicit consent.</em></p>
          <p data-custom-class="body_text">We process your personal information for a variety of reasons, depending on how you interact with our Services.</p>
          <ul style={{ marginLeft: '2rem' }}>
            <li data-custom-class="body_text"><strong>To save or protect an individual's vital interest.</strong> We may process your information when necessary to save or protect an individual's vital interest, such as to prevent harm.</li>
          </ul>
        </section>

        <section id="infominors" style={{ marginBottom: '3rem' }}>
          <h2 data-custom-class="heading_1" style={{ marginBottom: '1rem' }}>3. DO WE COLLECT INFORMATION FROM MINORS?</h2>
          <p data-custom-class="body_text"><strong><em>In Short:</em></strong> <em>We do not knowingly collect data from or market to minors.</em></p>
          <div data-custom-class="body_text" style={{ marginTop: '1rem' }}>
            <p><strong>Protection of Minors and Age Limitations</strong></p>
            <p><strong>1. Age Restriction</strong></p>
            <p>Cristi Labs LLC operates at the intersection of global trade infrastructure, Real-World Asset (RWA) liquidity, and advanced digital ecosystems. Due to the complex, financial, and commercial nature of our platforms—including the Aura Protocol and related neuromorphic web services—our Website and Services are strictly intended for individuals who are at least eighteen (18) years of age, or the age of legal majority in their respective jurisdiction of residence.</p>
            
            <p style={{ marginTop: '1rem' }}><strong>2. No Collection of Minor Data</strong></p>
            <p>We do not knowingly solicit, collect, process, or maintain personal information from individuals under the age of 18. Minors are expressly prohibited from utilizing our platforms, executing agreements, or submitting any personal data to Cristi Labs LLC.</p>
            
            <p style={{ marginTop: '1rem' }}><strong>3. Remediation</strong></p>
            <p>If we become aware that we have inadvertently collected personal data from a minor without legally valid parental or guardian consent, we will take immediate and decisive action to purge such information from our servers and infrastructure.</p>
            
            <p style={{ marginTop: '1rem' }}><strong>4. Contact Mechanism for Guardians</strong></p>
            <p>If you are a parent or legal guardian and believe that a minor under your care has provided personal data to Cristi Labs LLC, please contact our compliance team immediately at <a data-custom-class="link" href="mailto:privacy@cristilabs.net">privacy@cristilabs.net</a> so that we may take the appropriate corrective measures.</p>
          </div>
        </section>

        <section id="privacyrights" style={{ marginBottom: '3rem' }}>
          <h2 data-custom-class="heading_1" style={{ marginBottom: '1rem' }}>4. WHAT ARE YOUR PRIVACY RIGHTS?</h2>
          <p data-custom-class="body_text"><strong><em>In Short:</em></strong> <em>Depending on your state of residence in the US or in some regions, such as the European Economic Area (EEA), United Kingdom (UK), Switzerland, and Canada, you have rights that allow you greater access to and control over your personal information. You may review, change, or terminate your account at any time, depending on your country, province, or state of residence.</em></p>
          <p data-custom-class="body_text" style={{ marginTop: '1rem' }}>In some regions (like the EEA, UK, Switzerland, and Canada), you have certain rights under applicable data protection laws. These may include the right (i) to request access and obtain a copy of your personal information, (ii) to request rectification or erasure; (iii) to restrict the processing of your personal information; (iv) if applicable, to data portability; and (v) not to be subject to automated decision-making.</p>
          <p data-custom-class="body_text" style={{ marginTop: '1rem' }}>If you have questions or comments about your privacy rights, you may email us at <a data-custom-class="link" href="mailto:access@cristilabs.net">access@cristilabs.net</a>.</p>
        </section>

        <section id="contact" style={{ marginBottom: '3rem' }}>
          <h2 data-custom-class="heading_1" style={{ marginBottom: '1rem' }}>5. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</h2>
          <p data-custom-class="body_text">If you have questions or comments about this notice, you may email us at <a data-custom-class="link" href="mailto:access@cristilabs.net">access@cristilabs.net</a> or contact us by post at:</p>
          <div style={{ marginTop: '1rem', marginLeft: '1rem', lineHeight: '1.8' }}>
            <p data-custom-class="body_text"><strong>Cristi Labs</strong></p>
            <p data-custom-class="body_text">30 N Gould St</p>
            <p data-custom-class="body_text">Ste R</p>
            <p data-custom-class="body_text">Sheridan, WY 82801</p>
            <p data-custom-class="body_text">United States</p>
          </div>
        </section>

        <section id="request" style={{ marginBottom: '3rem' }}>
          <h2 data-custom-class="heading_1" style={{ marginBottom: '1rem' }}>6. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?</h2>
          <p data-custom-class="body_text">Based on the applicable laws of your country or state of residence in the US, you may have the right to request access to the personal information we collect from you, details about how we have processed it, correct inaccuracies, or delete your personal information. You may also have the right to withdraw your consent to our processing of your personal information. These rights may be limited in some circumstances by applicable law. To request to review, update, or delete your personal information, please <a data-custom-class="link" href="https://app.termly.io/dsar/57134048-f223-4a66-b890-993b2f4f50e7" target="_blank" rel="noopener noreferrer">fill out and submit a data subject access request</a>.</p>
        </section>

        <footer style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #e0e0e0', textAlign: 'center' }}>
          <p data-custom-class="body_text" style={{ fontSize: '12px', color: '#999' }}>
            This Privacy Policy was created using Termly's <a data-custom-class="link" href="https://termly.io/products/privacy-policy-generator/" target="_blank" rel="noopener noreferrer">Privacy Policy Generator</a>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Privacy;
