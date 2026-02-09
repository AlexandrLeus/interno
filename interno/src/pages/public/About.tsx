import FeatureBlock from "../../components/ui/FeatureBlock";
import whatWeDo from '../../assets/images/WhatWeDo.png';
import TheEndResult from '../../assets/images/TheEndResult.png'
import PageHeader from '../../components/ui/PageHeader';
import AboutImg from '../../assets/images/About.png';
const About = () => {
  return (<div>
    <PageHeader text='About Us' imageUrl={AboutImg} />
    <FeatureBlock
      title="What We Do"
      text="It is a long established fact that a reader will be distracted by the of readable content of a page 
when lookings at its layouts the points of using 
that it has a more-or-less normal."
      imageUrl={whatWeDo}
      imagePosition="right"
      buttonText="Our Concept"
    />
    <FeatureBlock
      title="The End Result"
      text="It is a long established fact that a reader will be distracted by the of readable content of a page 
when lookings at its layouts the points of using 
that it has a more-or-less normal."
      imageUrl={TheEndResult}
      imagePosition="left"
      buttonText="Our Portfolio"
    />
  </div>)
}

export default About;