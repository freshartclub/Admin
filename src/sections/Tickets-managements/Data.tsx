import { _mock } from "src/_mock";

const generateUniqueId = () => `ID-${Math.random().toString(36).substr(2, 9)}`;

export const tickets = [
    {
        UniqueID: generateUniqueId(),
        TicketNumber: "TICKET001",
        Title: "Login Issue",
        Time: "2024-10-10T09:30:00Z",
        Description: "The user is experiencing issues while trying to log in to the application. They have attempted resetting their password but still cannot access their account. This has been an ongoing issue for the last few days, and the user requires immediate assistance to resolve it.",
        Name: "John Doe",
        Image: _mock.image.avatar(1),
        Status: "Created"
    },
    {
        UniqueID: generateUniqueId(),
        TicketNumber: "TICKET002",
        Title: "Feature Request",
        Time: "2024-10-10T10:15:00Z",
        Description: "A user has requested the implementation of a dark mode feature for the application. This feature would enhance user experience, especially in low-light environments. Users believe that having the option to switch to dark mode would greatly improve usability and comfort during nighttime usage.",
        Name: "Jane Smith",
        Image: _mock.image.avatar(1),
        Status: "Dispatched"
    },
    {
        UniqueID: generateUniqueId(),
        TicketNumber: "TICKET003",
        Title: "Bug Report",
        Time: "2024-10-10T11:00:00Z",
        Description: "The application crashes consistently when users attempt to save a file. This issue seems to occur across various devices and operating systems, leading to a loss of important data. Users are frustrated by this problem, and it needs urgent attention from the development team.",
        Name: "Alice Johnson",
        Image: _mock.image.avatar(1),
        Status: "Technical Finish"
    },
    {
        UniqueID: generateUniqueId(),
        TicketNumber: "TICKET004",
        Title: "Account Recovery",
        Time: "2024-10-10T12:30:00Z",
        Description: "A user is having trouble recovering their account after forgetting their password. Despite following the recovery process, they have not received the necessary emails to reset their password. This situation has left them locked out of their account, and they seek quick resolution.",
        Name: "Bob Brown",
        Image: _mock.image.avatar(1),
        Status: "In progress"
    },
    {
        UniqueID: generateUniqueId(),
        TicketNumber: "TICKET005",
        Title: "Payment Issue",
        Time: "2024-10-10T13:45:00Z",
        Description: "A user reported that their payment did not go through while trying to purchase a subscription. They have checked their bank details and confirm sufficient funds are available. Immediate assistance is required to ensure that the user can complete their transaction without further delays.",
        Name: "Emma Wilson",
        Image: _mock.image.avatar(1),
        Status: "Finalise"
    },
    {
        UniqueID: generateUniqueId(),
        TicketNumber: "TICKET006",
        Title: "App Update Error",
        Time: "2024-10-10T14:15:00Z",
        Description: "Users are encountering errors when attempting to update the application. The update fails halfway through the process, causing frustration. Many users are unable to access new features or security patches, which is critical for maintaining app functionality and user satisfaction.",
        Name: "Michael Taylor",
        Image: _mock.image.avatar(1),
        Status: "Finalise"
    },
    {
        UniqueID: generateUniqueId(),
        TicketNumber: "TICKET007",
        Title: "Data Sync Failure",
        Time: "2024-10-10T15:00:00Z",
        Description: "There are reports of data synchronization failures between the mobile and web versions of the application. Users notice discrepancies in their data, which leads to confusion and loss of trust in the application's reliability. This issue needs urgent investigation.",
        Name: "Sarah Miller",
        Image: _mock.image.avatar(1),
        Status: "Finalise"
    },
    {
        UniqueID: generateUniqueId(),
        TicketNumber: "TICKET008",
        Title: "Profile Update Problem",
        Time: "2024-10-10T15:30:00Z",
        Description: "A user is unable to update their profile information. After entering the new details and clicking save, the changes do not reflect. This issue is affecting several users, and it is essential to address it promptly to maintain user engagement and satisfaction.",
        Name: "David Harris",
        Image: _mock.image.avatar(1),
        Status: "Finalise"
    },
    {
        UniqueID: generateUniqueId(),
        TicketNumber: "TICKET009",
        Title: "Notification Glitch",
        Time: "2024-10-10T16:00:00Z",
        Description: "Users are not receiving notifications for important updates and messages. This issue affects user engagement and could lead to missed opportunities. Immediate action is required to fix the notification system to ensure that users stay informed.",
        Name: "Laura Clark",
        Image: _mock.image.avatar(1),
        Status: "Finalise"
    },
    {
        UniqueID: generateUniqueId(),
        TicketNumber: "TICKET010",
        Title: "Subscription Cancellation",
        Time: "2024-10-10T16:30:00Z",
        Description: "A user wishes to cancel their subscription but is facing difficulties in the cancellation process. They have followed the steps provided in the app but have not seen any confirmation. Assistance is needed to ensure the user's request is processed quickly and efficiently.",
        Name: "James Lee",
        Image: _mock.image.avatar(1),
        Status: "Finalise"
    }
];
