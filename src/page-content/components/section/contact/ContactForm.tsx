"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import GradientButton from "@/components/button/GradientButton";
import { useLanguage } from "@/core/runtime";
import {
  getButtonTranslation,
  getFormTranslation,
} from "@/core/translations";
import { getPublicApiEndpoint } from "@/core/utils";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import FormDisclaimer from "../common/FormDisclaimer";
import { getContacts } from "@/core/runtime";

type ContactFormProps = {
  subject?: string;
};

type ContactFormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type ContactFormErrors = Partial<Record<keyof ContactFormData, string>>;

const initialFormData = (subject?: string): ContactFormData => ({
  name: "",
  email: "",
  subject: subject ?? "",
  message: "",
});

export default function ContactForm({ subject }: ContactFormProps) {
  const { lang } = useLanguage();
  const formTranslations = getFormTranslation(lang);
  const buttonTranslation = getButtonTranslation(lang);

  const [formData, setFormData] = useState<ContactFormData>(() =>
    initialFormData(subject),
  );
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [dialogType, setDialogType] = useState<"success" | "error" | null>(
    null,
  );

  const contactEmail = getContacts().find((c) => c.type === "EMAIL")?.value;
  const mailtoHref = `mailto:${contactEmail}?subject=${encodeURIComponent(
    formData.subject,
  )}&body=${encodeURIComponent(formData.message)}`;

  const handleChange =
    (field: keyof ContactFormData) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;

      setFormData((current) => ({
        ...current,
        [field]: value,
      }));

      setErrors((current) => ({
        ...current,
        [field]: undefined,
      }));

      setSubmitError("");
    };

  const validateForm = () => {
    const nextErrors: ContactFormErrors = {};

    if (!formData.name.trim()) {
      nextErrors.name = formTranslations.name.errorMessage;
    }

    if (
      !formData.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      nextErrors.email = formTranslations.email.errorMessage;
    }

    if (!formData.subject.trim()) {
      nextErrors.subject = formTranslations.subject.errorMessage;
    }

    if (!formData.message.trim()) {
      nextErrors.message = formTranslations.message.errorMessage;
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (isSubmitting || !validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch(getPublicApiEndpoint("contact"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          subject: formData.subject.trim(),
          message: formData.message.trim(),
          locale: lang,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send contact message.");
      }

      setFormData(initialFormData(subject));
      setErrors({});
      setDialogType("success");
    } catch {
      if (contactEmail) {
        setDialogType("error");
      } else {
        setSubmitError(formTranslations.sendError);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    setFormData((current) => ({
      ...current,
      subject: subject ?? "",
    }));
  }, [subject]);

  return (
    <>
      {/*
        The form is a card in the Figma frame: 560 wide with 40 of padding, fields 60 tall
        and the send button on its own row. The tinted surface is what separates it from the
        contact details beside it, since the section itself has no background.
      */}
      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={(event) => {
          event.preventDefault();
          void handleSubmit();
        }}
        sx={(theme) => ({
          p: { xs: "24px", md: "40px" },
          borderRadius: "25px",
          border: `1px solid ${theme.palette.surfaces.border}`,
          backgroundColor: theme.palette.surfaces.tint,
          "& .MuiOutlinedInput-root": { borderRadius: "16px" },
        })}
      >
        <Box display="flex" flexWrap="wrap" gap={2} mb={3}>
          <Box flex="1 1 260px" minWidth={0}>
            <Typography variant="subtitle2" mb={0.5}>
              {formTranslations.name.label}
            </Typography>

            <TextField
              fullWidth
              required
              name="name"
              value={formData.name}
              placeholder={formTranslations.name.placeholder}
              error={Boolean(errors.name)}
              helperText={errors.name}
              disabled={isSubmitting}
              onChange={handleChange("name")}
            />
          </Box>

          <Box flex="1 1 260px" minWidth={0}>
            <Typography variant="subtitle2" mb={0.5}>
              {formTranslations.email.label}
            </Typography>

            <TextField
              fullWidth
              required
              type="email"
              name="email"
              value={formData.email}
              placeholder={formTranslations.email.placeholder}
              error={Boolean(errors.email)}
              helperText={errors.email}
              disabled={isSubmitting}
              onChange={handleChange("email")}
            />
          </Box>
        </Box>

        <Box mb={3}>
          <Typography variant="subtitle2" mb={0.5}>
            {formTranslations.subject.label}
          </Typography>

          <TextField
            fullWidth
            required
            name="subject"
            value={formData.subject}
            placeholder={formTranslations.subject.placeholder}
            error={Boolean(errors.subject)}
            helperText={errors.subject}
            disabled={isSubmitting}
            onChange={handleChange("subject")}
          />
        </Box>

        <Box mb={3}>
          <Typography variant="subtitle2" mb={0.5}>
            {formTranslations.message.label}
          </Typography>

          <TextField
            fullWidth
            required
            multiline
            rows={5}
            name="message"
            value={formData.message}
            placeholder={formTranslations.message.placeholder}
            error={Boolean(errors.message)}
            helperText={errors.message}
            disabled={isSubmitting}
            onChange={handleChange("message")}
          />
        </Box>

        {submitError && (
          <Typography color="error" mb={3}>
            {submitError}
          </Typography>
        )}

        <Box
          display="flex"
          flexWrap="wrap"
          alignItems="center"
          justifyContent="space-between"
          gap={4}
        >
          <Box flex="1 1 260px">
            <FormDisclaimer isHighContrast={false} />
          </Box>

          <Box
            sx={{
              display: "flex",
              position: "relative",
              width: { xs: "100%", sm: "auto" },
              justifyContent: { xs: "center", sm: "flex-start" },
              pointerEvents: isSubmitting ? "none" : "auto",
              opacity: isSubmitting ? 0.7 : 1,
            }}
          >
            <GradientButton
              onClick={() => {
                void handleSubmit();
              }}
            >
              {buttonTranslation.sendMessage}
            </GradientButton>

            {isSubmitting && (
              <CircularProgress
                size={24}
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  mt: "-12px",
                  ml: "-12px",
                }}
              />
            )}
          </Box>
        </Box>
      </Box>

      <Dialog
        open={dialogType !== null}
        onClose={() => setDialogType(null)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>
          {dialogType === "success"
            ? formTranslations.success.title
            : formTranslations.sendError}
        </DialogTitle>

        <DialogContent>
          {dialogType === "success" ? (
            <Typography>{formTranslations.success.message}</Typography>
          ) : (
            <Typography>
              {formTranslations.contactMessage}{" "}
              <Box
                component="a"
                href={mailtoHref}
                sx={{ color: "inherit", fontWeight: 600 }}
              >
                {contactEmail}
              </Box>
              .
            </Typography>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDialogType(null)}>
            {formTranslations.success.close}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
