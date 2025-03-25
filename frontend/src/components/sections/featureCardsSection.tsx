import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function FeaturesSection() {
  return (
    <div className="container mx-auto px-6 py-12">

      <h2 className="text-4xl font-bold text-center mb-[7rem]">What's in Nuxtake?</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Feature 1 */}
        <Card className="shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle>Real-time Collaboration</CardTitle>
            <CardDescription>Work seamlessly with your team in real time.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Share and edit content instantly, ensuring everyone stays on the same page.</p>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button asChild>
              <Link to="/features/collaboration">Learn More</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle>Customizable Interface</CardTitle>
            <CardDescription>Personalize your experience.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Tailor the app’s appearance and settings to match your workflow.</p>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button asChild variant="outline">
              <Link to="/features/customization">Learn More</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle>Advanced Analytics</CardTitle>
            <CardDescription>Gain insights with detailed reports.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Track performance metrics and make data-driven decisions.</p>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button asChild>
              <Link to="/features/analytics">Learn More</Link>
            </Button>
          </CardFooter>
        </Card>

      </div>
    </div>
  );
}
