import React, { FC } from 'react';

import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';

import { translations } from '../../../locales/i18n';
import styles from './PrivacyPolicy.module.css';

const PrivacyPolicy: FC = () => (
  <>
    <Helmet>
      <title>{t(translations.privacyPolicyPage.meta.title)}</title>
      <meta
        name="description"
        content={t(translations.privacyPolicyPage.meta.description)}
      ></meta>
    </Helmet>
    <div className={styles.wrapper}>
      <h1 className="text-center text-2xl">Sovryn&ndash; Privacy Policy</h1>
      <br />
      <ul>
        <li>
          <strong className="text-xl">1. Introduction</strong>
        </li>
      </ul>
      <br />
      <p>
        Sovryn considers that the protection of your Personal Data and the
        respect of your privacy is of primary concern.
      </p>
      <p>
        Sovryn, including its affiliates (hereafter "<strong>Sovryn</strong>
        ", "<strong>us</strong>
        ", "<strong>we"</strong>, "<strong>our"</strong>
        ), is committed to protecting the privacy of anyone who accesses and
        uses the different services offered through its App (
        <a href="http://www.sovryn.app">www.sovryn.app</a>) (the "
        <strong>App</strong>
        "), including providing access and information about the on-chain fully
        decentralized, community governed protocol deployed on the RSK
        blockchain (a Bitcoin side chain)&nbsp;for Bitcoin lending, borrowing,
        and margin trading (the
        <strong>&ldquo;Protocol&rdquo;,</strong>
        the "<strong>DAO</strong>
        "), (collectively, the
        <strong>"Services"</strong>
        ).&nbsp;
      </p>
      <p>
        We have published this Privacy Policy ("
        <strong>Policy</strong>
        ") to outline our practices with respect to collecting, processing, and
        disclosing the information collected from anyone who uses, accesses, or
        interacts with our App
        <strong>("Users", "You", "Your"</strong>
        ). By accessing or using the App, you agree to our collection, use, and
        disclosure practices, as well as any other activities described in this
        Privacy Policy. If you do not agree with the terms of this Privacy
        Policy, you should immediately discontinue the use of the Services and
        refrain from accessing the App.&nbsp;
      </p>
      <p>
        In this regard, please note that Sovryn is acting as a Data Controller
        while processing your Personal Data under your utilization of its
        Services.
      </p>
      <p>
        This Policy applies to you in addition to our Terms of Service. We
        encourage you to read these Terms and Policy carefully before using our
        Services.&nbsp;
      </p>
      <p>
        Our Services may be connected by &ldquo;hyperlinks&rdquo; to other third
        parties sites. We are not responsible in any way for the privacy
        practices on other third parties' sites and advise you to review the
        privacy policies on those linked sites before using them.
      </p>
      <p>
        If you have any questions or wish to exercise your rights and choices,
        please contact us at the email set forth in the "Contact Us" section
        below.
      </p>
      <br />
      <ul>
        <li>
          <strong className="text-xl">
            2. What types of data do we collect?
          </strong>
        </li>
      </ul>
      <br />
      <p>
        While you are using our Services, we collect and process your Personal
        Data ("
        <strong>Personal Data</strong>
        "). For the avoidance of any doubt, and pursuant to the definition
        provided by The Regulation (EU) 2016/679 of the European Parliament and
        of the Council of 27 April 2016 on the protection of natural persons
        with regard to the processing of personal data and the free movement of
        such data, and repealing Directive 95/46/EC ("
        <strong>General Data Protection Regulation", "GDPR</strong>
        "), "Personal Data" means any information relating to an identified or
        identifiable natural person (<strong>"data subject"</strong>
        ); an identifiable natural person is a person who can be identified,
        directly or indirectly, in particular by reference to an identifier such
        as a name, an identification number, location data, an online identifier
        or to one or more factors specific to the physical, physiological,
        genetic, mental, economic, cultural or social identity of that natural
        person.&nbsp;
      </p>
      <p>
        Please note that the processing of your Personal Data could be, in
        certain cases, required to allow the performance of our Services or to
        respond to one of your inquiries. This is especially the case when you
        decide to directly contact, for example via mail or us through the use
        of a website form. In any case, we will specify to you when and where
        such a processing activity of your Personal Data is non-optional.
      </p>
      <p>
        Furthermore, in the event where you would have to communicate us
        Personal Data from a third party, you commit yourself to making sure
        that this Data Subject has been duly informed of the processing activity
        over his or her Personal Data following the provisions of the present
        Privacy Policy.
      </p>
      <p>This section sets out the types of data collected from you.&nbsp;</p>
      <br />
      <ul>
        <li>
          <strong className="text-xl">2.1. Identification information</strong>
        </li>
      </ul>
      <br />
      <p>
        When you are using our Services, we process some of your contact and
        identification information. This includes especially your wallet address
        and your email address.&nbsp;
      </p>
      <p>
        We also collect some information from the device you are using to access
        our App that can indirectly identify you, especially your location data
        and IP address.
      </p>
      <br />
      <ul>
        <li>
          <strong className="text-xl">2.2. Communication information</strong>
        </li>
      </ul>
      <br />
      <p>
        When you send us an email or contact us via our App, we collect the
        Personal Data you provided us. This includes especially your name, email
        address, organization name, country of origin, phone number, address,
        and any other information that you chose to share with us.
      </p>
      <br />
      <ul>
        <li>
          <strong className="text-xl">2.3. Usage information</strong>
        </li>
      </ul>
      <br />
      <p>
        When you visit our website, we collect technical information about your
        interaction with our App. Such information may include geolocation data,
        IP address, unique identifiers (e.g., MAC address and UUID) as well as
        other information which relates to your activity through the
        Services.&nbsp;
      </p>
      <p>
        We may also utilize Tracking Technologies (defined below), including
        cookies, pixels, beacons, local storage, and similar technologies.
        Further information regarding the use of Tracking Technologies will be
        described in
        <strong>Section 7</strong>
        hereinafter.
      </p>
      <p>
        <strong>Why do we process your Personal Data?</strong>
      </p>
      <p>
        The above-mentioned collected data is processed for the hereafter listed
        purposes and legal basis.
      </p>
      <p>
        In any case, please note that we won't process your Personal Data for
        any incompatible purpose with the performance of our Services, its
        improvement, and the development of Sovryn activities.&nbsp;
      </p>
      <table>
        <tbody>
          <tr>
            <td>
              <p>
                <strong>Purpose</strong>
              </p>
            </td>
            <td>
              <p>
                <strong>Legal basis</strong>
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <p>
                Efficiency of our customer support services such as answering
                inquiries, questions and globally developing our client
                community.&nbsp;
              </p>
            </td>
            <td>
              <p>
                The legal basis for this processing activity is our legitimate
                interest and business purpose to offer an efficient and complete
                customer experience to our users and potential users.&nbsp;
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <p>
                Performance of our Services which includes operating and
                maintaining the Platform.&nbsp;
              </p>
            </td>
            <td>
              <p>
                The legal basis for this processing activity is the performance
                of our contractual obligations towards our users.
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <p>
                Promotion, development, and improvement of our offer of
                services, especially through the use of analytic, marketing, and
                advertising tools.&nbsp;
              </p>
              <p>
                <em>
                  Please note that if you do not want us to use or share your
                  Personal Data for advertising or marketing purposes, you may
                  opt out of certain Tracking Technologies, following the
                  instructions laid down in Section &lrm;7.
                </em>
              </p>
            </td>
            <td>
              <p>
                The legal basis for this processing activity is our legitimate
                interest and business purpose to develop the reach of our
                solutions and promote tailored services, content, and
                advertisements that better fit our users' interests.
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <p>Compliance with applicable laws.&nbsp;</p>
            </td>
            <td>
              <p>
                We may be legally required to collect, retain, or share your
                Personal Data in order for us to remain compliant with a
                specific legal framework.
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <p>Managing a potential or current litigation.</p>
            </td>
            <td>
              <p>
                The legal basis for this processing activity is our legitimate
                interest to defend our rights and interests in Courts.
              </p>
            </td>
          </tr>
        </tbody>
      </table>
      <br />
      <ul>
        <li>
          <strong className="text-xl">
            3. With whom do we share your data?
          </strong>
        </li>
      </ul>
      <br />

      <p>
        We might have to share your Personal Data with various natural persons
        and/or individuals or in a specific situation as described below:
      </p>
      <ul>
        <li>
          Group members and affiliates: we share your information within various
          relevant affiliates of Sovryn related to the Services that you have
          used and those with which you may be interested.
        </li>
        <li>
          Partners: We share your information with our partners and various IT
          service providers for the purpose of providing the Services.
        </li>
        <li>
          Compliance with laws and law enforcement entities: we may disclose any
          data about you to government bodies, law enforcement officials,
          Courts, or private parties as we, in our sole discretion, believe
          necessary or appropriate to respond to claims and legal processes
          (including but not limited to subpoenas), to protect our or a third
          party's property and rights, to protect the safety of the public or
          any person, or to prevent or stop any activity we may consider to be
          or to pose a risk of being, illegal, unethical, inappropriate or
          legally actionable. We also may be required to disclose an
          individual's Personal Data in response to a lawful request by public
          authorities, including meeting national security or law enforcement
          requirements.
        </li>
        <li>
          Professional advisors: we may share personal data with our attorneys,
          accountants, auditors, financial and other professionals who provide
          professional and corporate services to Sovryn.
        </li>
        <li>
          Merger and acquisitions: We may share your data if we enter into a
          business transaction such as a merger, acquisition, reorganization,
          bankruptcy, or sale of some or all of our assets. Any party that
          acquires our assets as part of such a transaction may continue to use
          your data in accordance with the terms of this Policy.&nbsp;
        </li>
      </ul>
      <br />
      <ul>
        <li>
          <strong className="text-xl">4. EU and UK residents</strong>
        </li>
      </ul>
      <br />
      <p>
        This section addresses the specific rights applying to residents of the
        EU or residents in other jurisdictions that afford the below rights.
      </p>
      <br />
      <ul>
        <li>
          <strong className="text-xl">4.1. Your rights</strong>
        </li>
      </ul>
      <br />
      <p>
        The European and UK Data protection legal framework grants any European
        or UK Data Subject various rights over its processed data, especially:
      </p>
      <ol>
        <li>
          (a) To receive confirmation as to whether or not your Personal Data is
          being processed, and access your stored Personal Data, together with
          supplementary information.&nbsp;
        </li>
        <li>
          (b) To withdraw, at any time, your consent to the processing activity,
          when it was initially based on this very consent, without harming the
          legality of the prior processing activity.
        </li>
        <li>
          (c) To receive a copy of Personal Data you directly volunteer to us in
          a structured, commonly used, and machine-readable format.&nbsp;
        </li>
        <li>
          (d) To request a rectification of your Personal Data that is in our
          control.
        </li>
        <li>(e) To request the erasure of your Personal Data.&nbsp;</li>
        <li>(f) To object to the processing of your Personal Data.&nbsp;</li>
        <li>(g) To request to restrict processing of your Personal Data.</li>
        <li>(h) To request the transfer of your Personal Data.</li>
        <li>
          (i) To determine what to do with the processed Personal Data after the
          death of the Data Subject.
        </li>
        <li>(j) To lodge a complaint with a supervisory authority.</li>
      </ol>
      <p>
        Please note that these rights are not absolute, and may be subject to
        our own legitimate interests and regulatory requirements.&nbsp;
      </p>
      <p>
        To exercise any of the above-mentioned Data Subject's rights, please
        directly address your request to:{' '}
        <a href="mailto:info@sovryn.app">info@sovryn.app</a>
      </p>
      <br />
      <ul>
        <li>
          <strong className="text-xl">
            4.2. Transfer of data outside the EU or the UK
          </strong>
        </li>
      </ul>
      <br />
      <p>
        Any information that we collect (including your Personal Data) may be
        stored and processed in various jurisdictions around the world, for the
        purposes detailed in this Policy. However, we will only transfer your
        data to data recipients that are either (i) located in the European
        Economic Area (the &ldquo;
        <strong>EEA</strong>
        &rdquo;), either (ii) non-located in one of the EEA countries but rather
        in one that has been approved by the European Commission as providing an
        adequate level of data protection, or (iii) entered into legal
        agreements ensuring an adequate level of data protection following the
        definition approved by the European Commission the European applicable
        legal framework and the European Court of Justice relevant case-law, or
        the UK Information Commissioner's Office ("
        <strong>ICO</strong>
        "), as applicable, regarding data protection and privacy.
      </p>
      <br />
      <ul>
        <li>
          <strong className="text-xl">
            5. California and Virginia and Colorado Residents
          </strong>
        </li>
      </ul>
      <br />
      <p>
        This section addresses the specific rights applying to residents of
        California, Virginia, Colorado, or other jurisdictions that afford the
        below rights. This section is based on the California Consumer Privacy
        Act of 2018 (&ldquo;
        <strong>CCPA</strong>
        &rdquo;), Virginia Consumer Data Protection Act (
        <strong>"VCDPA"</strong>
        )&nbsp;and Colorado Consumer Privacy Act ("
        <strong>CPA</strong>
        "), (collectively, "<strong>US Regulations"</strong>)
      </p>
      <br />
      <ul>
        <li>
          <strong className="text-xl">
            5.1. Selling of Personal Information
          </strong>
        </li>
      </ul>
      <br />
      <p>
        We do not &ldquo;sell&rdquo; the personal information we collect (as
        such term is defined in the US Regulations) for monetary value.&nbsp;
      </p>
      <br />
      <ul>
        <li>
          <strong className="text-xl">5.2. Your rights</strong>
        </li>
      </ul>
      <br />
      <p>
        As a resident of any of the US Regulations' jurisdiction we grant you
        various rights regarding the Personal Information we collect, especially
        the following:
      </p>
      <ol>
        <li>
          To request information regarding how we have collected, used and
          shared your Personal Information during the past 12 months.&nbsp;
        </li>
        <li>
          To access your information, by requesting a copy of your Personal
          Information.&nbsp;
        </li>
        <li>
          To delete the Personal Information, we maintain about you.&nbsp;
        </li>
        <li>
          If, in the future, we will sell your Personal Information, you will
          have the right to opt-out. In such case, there will publish a "Do Not
          Sell My Information" link in the App.&nbsp;
        </li>
        <li>
          To receive non-discriminatory treatment for the exercise of your
          privacy rights.
        </li>
      </ol>
      <p>
        Please note that these rights are not absolute, and may be subject to
        our own legitimate interests and regulatory requirements.&nbsp;
      </p>
      <p>
        To exercise any of the above-mentioned Data Subject's rights, please
        directly address your request to:{' '}
        <a href="mailto:info@sovryn.app">info@sovryn.app</a>
      </p>
      <p>
        You may empower an "authorized agent" (as defined in the US Regulations)
        to submit requests on your behalf, subject to a written authorization.
      </p>
      <br />
      <ul>
        <li>
          <strong className="text-xl">6. How do we protect your data?</strong>
        </li>
      </ul>
      <br />
      <p>
        We have implemented administrative, technical, and physical safeguards
        to help prevent unauthorized access, use, or disclosure of your Personal
        Data.&nbsp;
      </p>
      <p>
        While we seek to protect your information to ensure that it is kept
        confidential, we cannot guarantee the security of any information. You
        should be aware that there is always some risk involved in transmitting
        information over the internet and that there is also some risk that
        others could find a way to thwart our security systems. Such breaches
        can lead to things such as reputational harm, fraud, or identity theft.
        Therefore, we encourage you to exercise discretion regarding the
        Personal Data you choose to disclose. If you feel that your privacy was
        treated not in accordance with our Policy, or if any person attempted to
        abuse the App or acted inappropriately, please contact us directly
        through the contact details available below.
      </p>
      <br />
      <ul>
        <li>
          <strong className="text-xl">7. Retention</strong>
        </li>
      </ul>
      <br />
      <p>
        We will retain your Personal Data for as long as necessary to provide
        our Services, and as necessary to comply with our legal obligations,
        resolve disputes, and enforce our policies. Retention periods will be
        determined to take into account the type of information that is
        collected and the purpose for which it is collected, bearing in mind the
        requirements applicable to the situation and the need to destroy
        outdated, unused information at the earliest reasonable time.
      </p>
      <br />
      <ul>
        <li>
          <strong className="text-xl">
            8. Our use of Tracking Technologies
          </strong>
        </li>
      </ul>
      <br />
      <p>
        When you visit our App or access our Services, we use cookies, pixels,
        beacons, local storage, and similar technologies ("
        <strong>Tracking Technologies</strong>
        "). These allow us to automatically collect information about you, your
        device, and your online behavior, in order to enhance your navigation in
        our App, improve our Service's performance, perform analytics, customize
        your experience and offer you, for example, tailored content and
        advertisements that better correspond with your interests.&nbsp;
      </p>
      <br />
      <ul>
        <li>
          <strong className="text-xl">
            8.1 What types of Tracking Technologies do we use?
          </strong>
        </li>
      </ul>
      <br />
      <p>
        When you use or access our Services, we use the following categories of
        Tracking Technologies:&nbsp;
      </p>
      <p>
        (a) Strictly Necessary Tracking Technologies: these Tracking
        Technologies are automatically placed on your computer or device when
        you access our Services or take certain actions on our App. These
        Tracking Technologies are essential to enable you to navigate around and
        use the features of our Services. We do not need to obtain your consent
        in order to use these Tracking Technologies.
      </p>
      <p>
        (b) Tracking and Advertising Tracking Technologies: these Tracking
        Technologies collect information about your browsing habits in order to
        make advertising more relevant to you and your interests. They are also
        used to limit the number of times you see an advertisement as well as
        help measure the effectiveness of an advertising campaign. The Tracking
        Technologies remember the websites you visit and that information is
        shared with other parties such as advertisers and/or publishers.
        Publishers, advertisers, and third-party ad networks may also utilize
        Tracking Technologies or similar technologies to deliver ads and monitor
        the performance of such ads. The collection of information through
        Tracking Technologies by such third parties will be governed by their
        own privacy policies/cookies policies and principles, which Sovryn does
        not control.
      </p>
      <p>
        (c) Functionality Tracking Technologies: these Tracking Technologies
        allow our Services to remember choices you make (such as your language)
        and provide enhanced and personalized features. For example, these
        Tracking Technologies are used for authentication (to remember when you
        are logged in) and support other features of our Services;&nbsp;
      </p>
      <p>
        (d) Performance Tracking Technologies: these Tracking Technologies
        collect information about your online activity (for example the duration
        of your visit to our Services), including behavioral data and content
        engagement metrics. These Tracking Technologies are used for analytics,
        research, and performing statistics (based on aggregated
        information).&nbsp;
      </p>
      <br />
      <ul>
        <li>
          <strong className="text-xl">
            8.2 How and by whom Tracking Technologies are stored on your device?
          </strong>
        </li>
      </ul>
      <br />
      <p>
        We store Tracking Technologies on your device when you visit or access
        our Services (for example, when you are visiting our website) &ndash;
        these are called "First Party Tracking Technologies". In addition,
        Tracking Technologies are stored by other third parties (for example,
        our analytics service providers, business partners, and advertisers),
        who run content on our Services &ndash; these are called "Third Party
        Tracking Technologies". Both types of Tracking Technologies may be
        stored either for the duration of your visit to our Services or repeat
        visits.
      </p>
      <br />
      <ul>
        <li>
          <strong className="text-xl">
            8.3 How can you manage your Tracking Technologies?
          </strong>
        </li>
      </ul>
      <br />
      <p>
        There are various ways in which you can manage and control your Tracking
        Technologies settings. You can change your preferences using our cookie
        settings tool (however, please note that this tool may only be available
        in certain jurisdictions). Other methods of managing your Tracking
        Technology preferences include: changing your browser settings to send a
        &ldquo;Do-Not-Track&rdquo; signal. In such a case, your browser will
        send us a special signal to stop tracking your activity; you may also
        install a browser extension, such as&nbsp;Disconnect or
        Ghostery,&nbsp;to block third party tracking cookies on our website.
        However, please note that certain features of the website may not work
        properly or effectively if you delete or disable cookies.&nbsp;
      </p>
      <p>
        To learn more about how can manage your cookies, below is a list of
        useful links that can provide you with more information on how to manage
        your cookies. However, please remember that by deleting or blocking
        cookies, some of the features of our Services may not work properly or
        effectively.&nbsp;
      </p>
      <ul>
        <li>
          <a href="https://support.google.com/chrome/answer/95647?hl=en">
            Google Chrome
          </a>
        </li>
        <li>
          <a href="https://support.microsoft.com/en-us/help/260971/description-of-cookies">
            Internet Explorer
          </a>
        </li>
        <li>
          <a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer">
            Mozilla Firefox
          </a>
        </li>
        <li>
          <a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac">
            Safari (Desktop)
          </a>
        </li>
        <li>
          <a href="https://support.apple.com/en-us/HT201265">Safari (Mobile)</a>
        </li>
        <li>
          <a href="https://support.google.com/nexus/answer/54068?visit_id=637249861772874734-2281104728&amp;hl=en&amp;rd=1">
            Android Browser
          </a>
        </li>
      </ul>
      <br />
      <p>
        You can learn more and turn off certain third party targeting and
        advertising cookies by visiting the following third party webpages:
      </p>
      <ul>
        <li>
          <a href="https://www.iab.com/">
            The Interactive Advertising Bureau (US)
          </a>
        </li>
        <li>
          <a href="https://iabeurope.eu/">
            The Interactive Advertising Bureau (EU)
          </a>
        </li>
      </ul>
      <p>
        <a href="https://www.youronlinechoices.com/">
          European Interactive Digital Advertising Alliance (EU)
        </a>
      </p>
      <br />
      <ul>
        <li>
          <strong className="text-xl">9. Updates to this Policy</strong>
        </li>
      </ul>
      <br />
      <p>
        We reserve the right to change this Policy at any time. The most current
        version will always be posted on our App (as reflected in the
        &ldquo;Last Updated&rdquo; heading). You are advised to check for
        updates regularly. By continuing to access or use our Services after any
        revisions become effective, you agree to be bound by the updated Policy.
      </p>
      <br />
      <ul>
        <li>
          <strong className="text-xl">10. Further Information</strong>
        </li>
      </ul>
      <br />
      <p>
        If you have any further questions regarding the data collection, or how
        we use it, please contact us by email at{' '}
        <a href="mailto:info@sovryn.app">info@sovryn.app</a>
      </p>
      <br />
    </div>
  </>
);

export default PrivacyPolicy;
