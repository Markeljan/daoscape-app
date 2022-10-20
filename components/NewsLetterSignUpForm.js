import { useRef, useState } from "react";
import { Input, Button } from "@chakra-ui/react";
import { EmailIcon } from "@chakra-ui/icons";

export default function NewsLetterSignUpForm() {
  const inputRef = useRef(null);
  const [submitted, setSubmitted] = useState(false);

  const subscribeUser = async (e) => {
    e.preventDefault();
    console.log("submitting");
    // this is where your mailchimp request is made

    const res = await fetch("/api/subscribeUser", {
      body: JSON.stringify({
        email: inputRef.current.value,
      }),

      headers: {
        "Content-Type": "application/json",
      },

      method: "POST",
    });

    res.ok && setSubmitted(true);
  };

  return (
    <form onSubmit={subscribeUser}>
      <Input
        type="email"
        id="email-input"
        name="email"
        placeholder="your email"
        variant="filled"
        ref={inputRef}
        required
        autoCapitalize="off"
        autoCorrect="off"
        mb={3}
      />
      <Button type="submit" colorScheme="teal" width={"100%"}>
        {submitted ? "Subscribed!" : <EmailIcon w={6} h={6} />}
      </Button>
    </form>
  );
}
