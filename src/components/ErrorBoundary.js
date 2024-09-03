// import React from "react";

// class ErrorBoundary extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { hasError: false };
//   }

//   static getDerivedStateFromError() {
//     // Update state to render fallback UI
//     return { hasError: true };
//   }

//   componentDidCatch(error, errorInfo) {
//     // Log error details
//     console.error("Error caught in ErrorBoundary:", error, errorInfo);
//   }

//   render() {
//     if (this.state.hasError) {
//       // Fallback UI when error occurs
//       return (
//         <div
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             justifyContent: "center",
//             height: "100vh",
//             backgroundColor: "#f5f5f5",
//           }}
//         >
//           <h1 style={{ color: "#e53935", marginBottom: "16px" }}>
//             We are very sorry for this inconvenience.
//           </h1>
//           <p style={{ color: "#666666", marginBottom: "16px" }}>
//             We are currently working on something new and we will be back soon
//             with awesome new features. Thanks for your patience.
//           </p>
//         </div>
//       );
//     }

//     return this.props.children;
//   }
// }

// export default ErrorBoundary;
