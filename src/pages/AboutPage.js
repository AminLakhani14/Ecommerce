import { Container } from 'react-bootstrap';
import ContentBlock from '../components/ContentBlock'; // <-- Import our new component

const AboutPage = () => {
  return (
    // We use a fluid container to allow the content blocks to be full-width
    <Container fluid className="px-0">
      
      {/* --- Section 1: About Us (Text | Image) --- */}
      <ContentBlock
        imageSrc="https://savvysouthernchic.com/wp-content/uploads/2022/11/Depositphotos_265180406_S.jpg"
        imageAlt="Man working out"
        title="ABOUT US"
        imageLeft={false} // Image on the right
      >
        <p className="lead">
          We are AG-Store. We exist to unite the fashion-forward community.
        </p>
        <p>
          It's not our goals that unite us, but the things we do to achieve them. Our legacy began in 2024, from a vision to create the tools that help everyone become their personal best. The clothing you'll find inspiration in, the content you'll find motivation in, and the community you'll become a part of.
        </p>
        <p>
          Our family of employees, athletes, and followers is now over 10 million strong, with a total social media following of over 18 million and customers in over 230 countries.
        </p>
      </ContentBlock>

      {/* --- Section 2: Our Core Values (Image | Text) --- */}
      <ContentBlock
        imageSrc="https://www.fashiongonerogue.com/wp-content/uploads/2023/07/Street-Style-Woman-High-Waist-Jeans-Coat.jpg"
        imageAlt="Woman athlete"
        title="OUR CORE VALUES"
        imageLeft={true} // Image on the left
      >
        <p>Our values are invaluable. We lose them, we lose everything.</p>
        <h5 className="mt-4">BE HUMAN.</h5>
        <p>Being accessible, inclusive, and humble is at AG-Store's heart.</p>
        <h5 className="mt-4">GIVE A DAMN.</h5>
        <p>That means being conscious of the world we live in, caring for those around us and being proactive to create positive change.</p>
        <h5 className="mt-4">FIND THE AG-STORE WAY.</h5>
        <p>Refuse to forget the garage mentality that made us: ambitious, agile, disruptive.</p>
      </ContentBlock>

      {/* --- Section 3: Get In Touch (Text | Image) --- */}
      <ContentBlock
        imageSrc="https://sourcingjournal.com/wp-content/uploads/2020/01/shutterstock_editorial_10518546j.jpg?w=910&h=511&crop=1"
        imageAlt="Fitness equipment"
        title="GET IN TOUCH"
        imageLeft={false} // Image on the right
      >
        <p>For media and press enquiries please email:<br/>
          <a href="mailto:press@agstore.com"><strong>press@agstore.com</strong></a>
        </p>
        <p>For general business enquiries please email:<br/>
          <a href="mailto:corporate@agstore.com"><strong>corporate@agstore.com</strong></a>
        </p>
        <p>For all customer service enquiries please visit our <a href="/contact"><strong>Contact us</strong></a> page.</p>
      </ContentBlock>

    </Container>
  );
};

export default AboutPage;