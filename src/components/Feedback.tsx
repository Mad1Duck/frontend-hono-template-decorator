export default function Feedback() {
  return (
    <section id="feedback" className="reveal">
      <div className="section-label">feedback</div>
      <h2 className="section-title">Share Your Thoughts</h2>
      <p className="section-desc">
        Have feedback, questions, or suggestions? Drop a message below.
      </p>
      <div className="feedback-container">
       <iframe src="https://wall-message-frontend.vercel.app/embed/form/mini-wall?wallId=8f9b6b08-d45d-4887-abae-e9791bc08857&miniWallId=67de5711-b8f2-4d87-96cd-efe8e4c75dc6&theme=dark&recipient=gandhi&radius=1&compact=1" width="100%" height="290" frameBorder="0"></iframe>
      </div>
      <div className="section-label">messages</div>
      <h2 className="section-title">Recent Feedback</h2>
      <p className="section-desc">
        See what others have shared.
      </p>
      <div className="feedback-container">
      <iframe src="https://wall-message-frontend.vercel.app/embed/display/mini-wall?miniWallId=67de5711-b8f2-4d87-96cd-efe8e4c75dc6&limit=10&theme=dark&compact=1&radius=1" width="100%" height="290" frameBorder="0"></iframe>
      </div>
    </section>
  )
}
