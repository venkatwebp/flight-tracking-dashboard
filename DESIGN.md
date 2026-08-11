# ✈️ Flight Operations Dashboard — Design Explanation

## 1. Introduction

The Flight Operations Dashboard is a responsive web application developed using **Angular 16** and **Leaflet Maps**.

The primary goal of the application is to provide an aviation-style interface for monitoring flight operations, aircraft positions, airport locations, flight routes, operational KPIs, and flight status information.

The application uses mock flight data to simulate a real-world flight tracking environment. The design focuses on usability, clear information hierarchy, responsive layouts, and maintainable Angular architecture.

## 2. Application Architecture

The application follows a feature-based Angular structure to keep the code organized, reusable, and easy to maintain.

The main areas of the application include:

- **Core** — Shared models and services used across the application.
- **Features** — Feature-specific components such as the flight map, flight details, and flight operations.
- **Assets** — Mock flight data and other static application resources.
- **Shared UI** — Reusable interface elements and common styling where required.

The application follows a clear separation of responsibilities:

- Components are responsible for UI presentation and user interactions.
- Services manage flight data and application state.
- Models define the structure of flight information.
- Leaflet is responsible for map rendering, markers, routes, and map interactions.

This structure makes the application easier to extend with additional flight operations features in the future.

## 3. UI/UX Design

The dashboard follows an aviation-inspired visual design with a clear information hierarchy.

The interface is divided into three primary areas:

- **Header** — Provides the application title and theme controls.
- **Flight Tracking Area** — Displays the interactive Leaflet map and selected flight information.
- **Operations Area** — Displays operational KPIs, search/filter controls, and the flight list.

### Design Principles

- Important operational information is presented prominently.
- KPI cards provide a quick overview of the current flight status.
- The map occupies a large visual area because aircraft tracking is the primary function.
- Flight details are displayed when a flight is selected.
- Search and filtering help users quickly locate specific flights.
- Light and dark themes improve usability in different viewing conditions.
- Responsive styling allows the dashboard to work on desktop and tablet screen sizes.

The interface uses consistent spacing, typography, cards, buttons, status indicators, and aviation-related visual elements to create a professional dashboard experience.

## 4. Flight Map Design

Leaflet Maps is used as the primary visualization component for real-time-style flight tracking.

The map displays multiple mock aircraft using custom aircraft-shaped markers. Each marker represents the current position of a flight and is oriented according to the calculated flight direction.

When a user selects a flight:

- The selected flight becomes the active flight.
- The origin and destination airports are displayed.
- A route polyline is drawn between the two airports.
- The map automatically adjusts to display the complete route.
- The Flight Details panel is updated with the selected flight information.

The map is initialized with a view centered on India and uses OpenStreetMap tiles as the map layer.

A separate Leaflet layer is maintained for:

- Aircraft markers
- Airport markers
- Flight routes

Separating these layers makes it easier to update or clear individual map elements without affecting the other layers.

## 5. State Management & Data Flow

The application uses an Angular service to manage flight data and selected-flight state.

The `FlightService` acts as the central data source for the dashboard.

### Flight Data Flow

The general data flow is:

1. Mock flight data is loaded from the application assets.
2. `FlightService` maintains the flight collection.
3. Components subscribe to the flight data through observables.
4. Search and status filters update the displayed flight collection.
5. When a user selects a flight, the selected flight is shared through the service.
6. The Flight Map and Flight Details components respond to the selected-flight state.

This approach avoids unnecessary direct communication between unrelated components and keeps the application state centralized.

### Reactive Approach

RxJS observables are used for communication between the service and components.

Subscriptions are properly managed using Angular's `takeUntilDestroyed` mechanism to avoid unnecessary subscriptions and potential memory leaks.

This design provides a simple and maintainable state-management approach suitable for the current application size.

## 6. Flight Animation Design

The dashboard provides Play, Pause, and Reset controls to simulate aircraft movement along the selected flight route.

When the user clicks **Play**, the selected aircraft moves progressively from its origin coordinates toward its destination coordinates.

The animation uses a progress value between `0` and `1`:

- `0` represents the origin.
- `0.5` represents the intermediate position.
- `1` represents the destination.

The aircraft's latitude and longitude are calculated by interpolating between the origin and destination coordinates.

The selected Leaflet marker is then updated with the calculated position.

### Animation Controls

- **Play** — Starts the aircraft movement.
- **Pause** — Stops the current animation while preserving the current position.
- **Reset** — Returns the aircraft to its origin position.
- **Replay** — Allows a completed animation to start again from the beginning.

The implementation also prevents multiple animation timers from being started when the flight is already playing.

This provides a simple visual simulation of aircraft movement while keeping the implementation lightweight and easy to understand.

## 7. Testing Strategy

Unit testing is implemented using **Jasmine and Karma** to verify the core functionality of the dashboard.

The test cases focus on important user interactions and component behavior, including:

- Component creation and initialization
- Flight data loading
- Flight selection
- Aircraft marker creation
- Airport marker rendering
- Route visualization
- Flight animation
- Play, Pause, and Reset controls
- Animation state handling
- Aircraft position updates
- Search and filtering behavior

The tests use mocked services where appropriate so that individual components can be tested independently from the actual application data flow.

The Flight Map component has been tested across multiple functional scenarios to ensure that map interactions, flight selection, route rendering, and animation behavior work as expected.

The goal of the testing approach is to provide confidence in the application's core functionality while keeping the test suite maintainable as new features are added.

## 8. Responsive Design & Accessibility

The dashboard is designed to work across desktop and tablet screen sizes.

Responsive CSS techniques are used to adjust:

- Dashboard layout
- KPI card arrangement
- Flight operations table
- Flight details panel
- Map dimensions
- Search and filter controls
- Spacing and typography

The layout adapts to smaller screen sizes while keeping the most important flight information accessible to the user.

The design also uses clear status labels, readable text, consistent contrast, and recognizable controls to improve usability.

Interactive elements such as buttons, search fields, filters, and map markers are designed to provide clear visual feedback during user interaction.

## 9. Technology Stack

The application is built using the following technologies:

| Technology | Purpose |
|---|---|
| Angular 16 | Frontend application framework |
| TypeScript | Application development language |
| Leaflet | Interactive map and flight visualization |
| OpenStreetMap | Map tile provider |
| RxJS | Reactive data flow and state communication |
| HTML5 | Application structure |
| SCSS | Styling and responsive UI |
| Jasmine | Unit testing framework |
| Karma | Test runner |
| Git & GitHub | Source control and project hosting |

The project uses Angular's component-based architecture and TypeScript to maintain a structured and scalable frontend codebase.

## 10. Design Decisions & Future Improvements

The application was designed with simplicity, maintainability, and usability as the primary considerations.

### Key Design Decisions

- **Angular feature-based structure** was selected to keep functionality organized and maintainable.
- **Leaflet** was selected because it provides lightweight and flexible map visualization.
- **RxJS and Angular services** are used for sharing flight data and selected-flight state.
- **Layered Leaflet architecture** separates aircraft, airport, and route elements.
- **Custom aircraft markers** provide a more aviation-focused user experience.
- **Responsive SCSS design** supports desktop and tablet layouts.
- **Mock JSON data** keeps the assignment self-contained and avoids dependency on external flight APIs.

### Future Improvements

If this application were extended into a production system, possible improvements would include:

- Integration with a real-time flight tracking API.
- WebSocket-based live aircraft position updates.
- Authentication and role-based access.
- Advanced flight history and analytics.
- More detailed airport information.
- Weather and air-traffic overlays.
- Route deviation and alert notifications.
- Improved accessibility and keyboard navigation.
- Automated end-to-end testing.
- Deployment through a cloud hosting platform.

## 11. Conclusion

The Flight Operations Dashboard provides a responsive and interactive interface for monitoring simulated flight operations.

The combination of Angular, Leaflet, reactive data handling, responsive UI design, and unit testing provides a solid foundation for a maintainable flight-tracking application.

The implementation focuses on the core requirements of the assignment while keeping the architecture flexible enough for future enhancements such as real-time flight data, advanced analytics, and production-grade integrations.