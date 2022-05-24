import { UserInterface } from "./../../interfaces/userInterface";
import { StateService } from "./../../services/state.service";
import { MessageAndAttachmentService } from "./../../services/message-and-attachment.service";
import { Component, OnInit } from "@angular/core";

import { ActivatedRoute } from "@angular/router";
import { SetupWSService } from "src/app/services/setup-ws.service";
import { Router } from "@angular/router";

@Component({
    selector: "app-chat",
    templateUrl: "./chat.component.html",
    styleUrls: ["./chat.component.css"],
})
export class ChatComponent implements OnInit {
    messageTo: string = "";
    messagesAndAttachments: any = [];
    username: string = "Loading...";
    gender: string = "male";
    isActive: boolean = false;
    messageContent: string = "";
    userId: string = "";

    constructor(
        private route: ActivatedRoute,
        private messaeAndAttachmentService: MessageAndAttachmentService,
        private setupWSService: SetupWSService,
        private router: Router,
        private stateService: StateService
    ) {
        this.messageTo = String(this.route.snapshot.paramMap.get("userId"));
    }

    ngOnInit(): void {
        if (!localStorage.getItem("token")) {
            this.router.navigate(["login"]);
            return;
        }

        sessionStorage.removeItem("messages");
        sessionStorage.removeItem("attachments");

        this.stateService.getAllUsers().subscribe((users: UserInterface[]) => {
            users.forEach((user: UserInterface) => {
                if (user.id == this.messageTo) {
                    this.username = user?.username;
                    this.gender = user.gender;
                    this.isActive = user.isActive;
                    this.userId = user.id;
                }
            });
            this.scrollToBottom();
        });

        this.messaeAndAttachmentService.setMessageTo(this.messageTo);
        this.messaeAndAttachmentService
            .getMessagesAndAttachments()
            .subscribe((data: any) => {
                sessionStorage.setItem(
                    "messages",
                    JSON.stringify(data.messages)
                );
                sessionStorage.setItem(
                    "attachments",
                    JSON.stringify(data.attachments)
                );
                this.setupWSService.setUpWs();
                this.sortMessagesAndAttachments();
            });
    }

    sortMessagesAndAttachments() {
        let messages = JSON.parse(String(sessionStorage.getItem("messages")));
        messages.forEach((message: any) => {
            message.createdOn = new Date(message.createdOn);
        });
        // messages.reverse();

        let attachments = JSON.parse(
            String(sessionStorage.getItem("attachments"))
        );
        attachments.forEach((attachment: any) => {
            attachment.createdOn = new Date(attachment.createdOn);
        });
        // attachments.reverse();

        let messagesAndAttachments = [];

        let messagePointer = 0,
            attachmentPointer = 0;
        while (
            messagePointer < messages.length ||
            attachmentPointer < attachments.length
        ) {
            if (
                attachmentPointer < attachments.length &&
                messagePointer < messages.length
            ) {
                if (
                    messages[messagePointer].createdOn <=
                    attachments[attachmentPointer].createdOn
                ) {
                    messagesAndAttachments.push(messages[messagePointer]);
                    messagePointer++;
                } else {
                    messagesAndAttachments.push(attachments[attachmentPointer]);
                    attachmentPointer++;
                }
            } else if (messagePointer < messages.length) {
                messagesAndAttachments.push(messages[messagePointer]);
                messagePointer++;
            } else if (attachmentPointer < attachments.length) {
                messagesAndAttachments.push(attachments[attachmentPointer]);
                attachmentPointer++;
            }
        }
        this.messagesAndAttachments = messagesAndAttachments;
    }

    sendMessage() {
        this.setupWSService.sendMessage({
            messageFrom: JSON.parse(String(localStorage.getItem("user"))).id,
            messageTo: this.messageTo,
            content: this.messageContent,
        });
    }

    deleteMessage(messageId: string) {
        this.setupWSService.deleteMessage(messageId);
    }

    deleteAttachment(attachmentId: string) {
        this.setupWSService.deleteAttachment(attachmentId);
    }

    triggerSelectFile() {
        document.getElementById("addFile")?.click();
    }

    sendFile() {
        let formData = new FormData();
        const x: any = document.getElementById("addFile");

        formData.append("image", x.files[0]);
        formData.append("attachmentTo", this.messageTo);
        this.setupWSService.sendAttachment(formData);
    }

    scrollToBottom() {
        setTimeout(() => {
            const element: any = document.getElementById("chat-window");
            element.lastElementChild.scrollIntoView();
        }, 100);
    }
}
