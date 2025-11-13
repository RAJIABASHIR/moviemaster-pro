import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props){ super(props); this.state = { hasError:false }; }
  static getDerivedStateFromError(){ return { hasError:true }; }
  componentDidCatch(err,info){ console.error(err, info); }
  render(){
    if (this.state.hasError) return <div className="max-w-lg mx-auto p-6 mt-16 card"><h1>Something went wrong</h1><p>Please refresh.</p></div>;
    return this.props.children;
  }
}