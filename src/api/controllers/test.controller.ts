import { Controller } from "@core/api/decorators/controller.decorator";
import { Get } from "@core/api/decorators/handlers.decorator";
import { Res } from "@core/api/decorators/res.decorator";
import { ResponseEntity } from "@core/api/entities/response.entity";
import { MetaRouteResponse } from "@core/api/server/interfaces/meta-route.response";
import { MetaRoute } from "@core/common/meta-route.container";
import path from "path";
import { AuthController } from "./auth.controller";

@Controller("/ui")
export class TestController {
  @Get("/")
  async testIndex(@Res() res: MetaRouteResponse) {
    const authController = MetaRoute.get(AuthController);
    const monitoringData = {
      name: authController.constructor.name,
      methods: Object.getOwnPropertyNames(AuthController.prototype).filter(
        (prop) =>
          typeof authController[prop as keyof AuthController] === "function"
      ),
    };
    MetaRoute.get(AuthController);
    return ResponseEntity.ok({
      template: path.join(process.cwd(), "public/index.html"),
      data: {
        title: "API Framework Documentation",
        heroTitle: "Welcome to Our API Framework",
        heroSubtitle: "Building robust APIs, one endpoint at a time.",
        showCTA: true,
        ctaLink: "/ui/documentation",
        ctaText: "Get Started with Our Framework",
        featuresTitle: "Key Features",
        features: [
          {
            title: "Easy to Use",
            description:
              "Our API framework is designed to be easy to use, with a clear and intuitive interface.",
          },
          {
            title: "Powerful Features",
            description:
              "Our framework includes powerful features that make it easy to build robust APIs.",
          },
          {
            title: "Great Documentation",
            description:
              "Our API framework includes comprehensive documentation to help you get started.",
          },
        ],
        testimonialsTitle: "What Our Users Say",
        testimonials: [
          { quote: "This framework is amazing!", author: "Happy Developer 1" },
          {
            quote: "I can't build APIs without this framework.",
            author: "Happy Developer 2",
          },
          {
            quote: "This framework has changed the way I build APIs.",
            author: "Happy Developer 3",
          },
        ],
        footerText: "© 2022 Our Company. All rights reserved.",
      },
    });
  }

  @Get("/documentation")
  async testDocumentation(@Res() res: MetaRouteResponse) {
    const allInstances = MetaRoute.getAllInstances();
    const instanceNames = allInstances.map((instance: any) => instance.constructor.name);

    return ResponseEntity.ok({
      template: path.join(process.cwd(), "public/documentation.html"),
      data: {
        docTitle: "API Framework Documentation",
        docIntro: "Learn how to use our API Framework to build robust APIs.",
        docSections: [
          {
            sectionTitle: "Getting Started",
            sectionContent:
              "To get started with our API Framework, you first need to install it. You can do this by running `npm install our-api-framework` in your terminal.",
          },
          {
            sectionTitle: "Creating Your First API",
            sectionContent:
              "Once you've installed our API Framework, you can create your first API by following these steps...",
          },
          {
            sectionTitle: "Advanced Features",
            sectionContent:
              "Our API Framework includes a number of advanced features that you can use to build robust APIs. These include...",
          },
          {
            sectionTitle: "Troubleshooting",
            sectionContent:
              "If you're having trouble with our API Framework, there are a number of resources available to help you. These include...",
          },
          {
            sectionTitle: "Framework Instances",
            sectionContent:
              "Here are some of the instances available in the framework: " +
              instanceNames.join(", "),
          },
        ],
        footerText: "© 2022 Our Company. All rights reserved.",
      },
    });
  }
}
