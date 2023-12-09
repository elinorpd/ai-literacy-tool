import React, { useEffect } from 'react';
import Header from './Header';
import './InfoPage.css';


const InfoPage = () => {
  useEffect(() => {
    // Get the hash from the URL (e.g., "#AILLO1")
    const hash = window.location.hash;

    // Scroll to the element with the matching ID
    if (hash) {
      const targetElement = document.getElementById(hash.substring(1));
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', duration: 50000});
      }
    }
  }, []);

  return (
    <div cl>
      <Header />
      <div class="centered-div">

        <h1>Who are we?</h1>
        <p>
        We are a team of graduate students at MIT. 
        This tool was built as a project for MIT <a href="https://mit-cml.github.io/gen-ai-fall-2023.github.io/" target="_blank">MAS.S10: Generative Artificial Intelligence in K-12 Education</a> by Elinor Poole-Dayan, Shrestha Mohanty, and Swati Garg. 
        We are passionate about the intersecting fields of technology and education and have built an Artificial Intelligence (AI) Literacy Lesson Planner tool that incorporates topics of AI within activities of existing lesson plans, enhancing educational experience and equipping students with valuable skills for the future.
        https://mit-cml.github.io/gen-ai-fall-2023.github.io/
        </p>

        <h1>What is Artificial Intelligence (AI)?</h1>
        <p>
          AI, or Artificial Intelligence, is a field of computer science that automates tasks that typically require human intelligence.
          This could be activities like recognizing speech, making decisions, translating languages, and recognizing patterns or images.
        </p>

        <h1>Why should you care?</h1>
        <p>
          As AI gains more prominence in the realm of education, it is essential to provide teachers with the necessary skills to
          harness its transformative potential. Incorporating AI into education offers a range of benefits, including but not
          limited to:
        </p>

        <ul>
          <li><strong>Personalized learning experiences:</strong> Adapting teaching materials to each student's unique needs and
            learning pace.</li>
          <li><strong>Enhanced efficiency in administrative tasks:</strong> Streamlining scheduling and attendance tracking,
            allowing teachers to focus more on teaching.</li>
          <li><strong>Assistance with grading and feedback:</strong> Identifying areas where students may need extra help.</li>
          <li><strong>Innovative teaching methodologies:</strong> Offering interactive learning experiences such as virtual
            simulations and educational games, making learning more engaging and effective.</li>
        </ul>

        <p>
          By embracing AI, educators can cater to diverse learning needs and prepare students for a future where technology plays a
          pivotal role.
        </p>

        <p>
          However, it is equally important to understand the limitations of AI. Recognizing where AI may fall short allows
          educators to navigate its implementation with a critical perspective. This knowledge enables informed decision-making,
          ensuring that AI is used as a valuable tool while being mindful of its constraints. By being aware of both the
          possibilities and limitations, educators can strike a balance that maximizes the benefits of AI while addressing
          potential challenges in the educational landscape.
        </p>

        <h1 id="AILLO">AI Literacy Learning Objectives:</h1>
        <h2 id="AILLO1">1. Understand the basic concept of AI, its main components, and everyday examples:</h2>
        <p>
          AI, or Artificial Intelligence, refers to machines or computer systems that are designed to perform tasks that
          typically require human intelligence. The main components include algorithms (step-by-step instructions), data
          (information used to train the system), and the ability to learn from experiences. Everyday examples include virtual
          assistants like Siri or Alexa, recommendation algorithms on streaming platforms, and predictive text on smartphones.
        </p>

        <h2 id="AILLO2">2. Discuss the ethical implications of AI, including issues of privacy, bias, and decision-making:</h2>
        <p>
          Explanation: AI raises ethical concerns about how it impacts our lives. Privacy issues involve the collection and use
          of personal data, while bias refers to unfair treatment due to pre-existing prejudices in AI algorithms. Decision-making
          concerns revolve around the potential for AI to make critical choices without human oversight, leading to ethical
          dilemmas.
        </p>

        <h2 id="AILLO3">3. Understand the concept of bias in AI and its societal implications:</h2>
        <p>
          Bias in AI occurs when algorithms favor certain groups over others. This can lead to unfair treatment or
          discrimination. For example, biased facial recognition software might be better at recognizing faces of certain
          ethnicities due to the data it has seen during its learning phase; referred to as training. This leads to unequal
          consequences. Societal implications include reinforcing existing inequalities and creating unfair advantages or
          disadvantages.
        </p>
        <h2 id="AILLO4">4. Understand the collaboration between human creativity and AI algorithms:</h2>
        <p>
          Collaboration between humans and AI involves using AI tools to enhance human creativity. For instance, artists can
          use AI to generate unique visual elements, musicians can incorporate AI-generated melodies, and writers can leverage
          AI for inspiration. The collaboration aims to combine the strengths of human creativity with the efficiency and
          innovation capabilities of AI.
        </p>
        <h2 id="AILLO5">5. Recognize the importance of digital privacy and the role of AI in data collection:</h2>
        <p>
          Digital privacy involves safeguarding personal information online. AI plays a role in data collection by analyzing
          user behavior to provide personalized services or targeted advertisements. However, concerns arise when data is
          mishandled or used without consent, highlighting the importance of balancing personalized experiences with privacy
          protection.
        </p>
        <h2 id="AILLO6">6. Understand the basics of safe online behavior in AI-integrated platforms:</h2>
        <p>
          Safe online behavior involves being cautious while using internet services, especially those with AI features. This
          includes avoiding sharing sensitive information with unreliable sources, using secure passwords, and being aware of
          potential online threats. Awareness and responsible usage are key to staying safe in AI-integrated platforms.
        </p>
        <h2 id="AILLO7">7. Evaluate the reliability of AI-driven content (e.g., deepfakes, automated articles, hallucinations):</h2>
        <p>
          Reliability assessment involves scrutinizing content generated by AI. Deepfakes are manipulated images/videos that
          appear to be factual, automated articles are written by algorithms, and hallucinations refer to fictitious
          AI-generated images or text. It's crucial to be aware of the potential for misinformation and to develop skills in
          discerning real from AI-generated content to make informed decisions and prevent the spread of false information.
        </p>

        <h1>Who is this tool meant for?</h1>
        <p>
          We envision our tool as a valuable resource for middle school teachers seeking to seamlessly integrate AI concepts
          into their lessons or those simply looking to refresh and find inspiration for new, engaging activities. However, it
          is crucial for teachers to verify the accuracy of content generated by AI before sharing it with students, ensuring
          the factual reliability of the information being imparted. We welcome all teachers to use the tool; Although, to fully
          harness its potential, a foundational understanding of AI would be beneficial.
        </p>

        <h1>How to use our tool?</h1>
        <ol>
          <li>Choose an existing lesson plan to upload into the tool.</li>
          <li>Click on the <b>Get Started</b> button.</li>
          <li>Use the headers mentioned (Lesson Title, Duration etc) to add the related fields from your lesson plan into
            the tool.</li>
          <li>If you want the AI to include an AI Literacy activity in the lesson plan, click on <b>AI Activity.</b></li>
          <ul>
            <li>Select the <b>AI Literacy Learning Objectives</b> you would like to cover as part of your lesson. We recommend picking
              any two objectives at a time. To learn more about the <b>‘AI Literacy Learning Objectives’</b>, 
              click on the objective or go <a href="#AILLO">here</a>.
            </li>
            <li>You can enter the <b>duration of the activity.</b></li>
            <li>In the ‘AI activity’ <b>Requirements</b> section, add any details/prompts/ideas you would like AI to consider while
              generating an AI Literacy activity for your lesson plan. The generated activity would cover the AI Literacy
              objectives you chose earlier in the ‘AI Literacy Learning Objectives’.</li>
            <li>If you would like the AI to suggest different activities for lower and advanced-level students, select the
              <b>Alternative Activities</b> checkbox.</li>
            <li>If you would like the AI to suggest an assessment to gauge students’ learning outcomes for the activity, select the
              <b>Assessment</b> checkbox.</li>
          </ul>
          <li>If you would like to update or refresh an existing activity <b>(non-AI related)</b> in your lesson plan, go to the
            ‘Activity’ section instead. The parameters of this activity section are similar to those of the AI activity section
            but geared towards directing the AI to suggest changes to existing activities.</li>
          <li>Click on <b>Save</b> and let the tool do its magic!</li>
          <li>Hit <b>Submit</b> and let the tool do its magic!</li>
        </ol>

        <h1> Resources:</h1>
        <p>UNESCO has defined a Competency Framework that every organization working for K12 education is recommended to follow.
            The details of the framework can be found below:</p>
        <p><a href="https://en.unesco.org/sites/default/files/competency_framework_e.pdf" target="_blank">UNESCO Competency Framework</a></p>

        <p>Another cool website that explains a lot of the AIED in K-12 education specifically is AI4K12. Check it out!</p>
        <p><a href="https://ai4k12.org/" target="_blank">AI4K12</a></p>

      </div>
    </div>
  );
}

export default InfoPage;
